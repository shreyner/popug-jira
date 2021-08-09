import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import * as redis from 'redis';
import createRedisStore from 'connect-redis';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CustomStrategy } from '@nestjs/microservices';
import { Listener } from '@nestjs-plugins/nestjs-nats-streaming-transport';

const RedisStore = createRedisStore(session);

async function bootstrap() {
  try {
    const redisClient = redis.createClient({
      prefix: 'accounting-service',
    });

    const optionsMicroservice: CustomStrategy = {
      strategy: new Listener(
        'test-cluster', //TODO: Вынести в env
        'accounting-service-listener',
        'accounting-service-group',
        {
          url: 'http://localhost:4222', //TODO: Вынести в env
        },
        {
          durableName: 'accounting-service-group',
          manualAckMode: true,
          deliverAllAvailable: true,
        },
      ),
    };

    const app = await NestFactory.create(AppModule);
    const configService = app.get<ConfigService>(ConfigService);

    app.use(morgan('tiny'));
    app.useGlobalPipes(new ValidationPipe());

    app.connectMicroservice(optionsMicroservice);
    app.useGlobalPipes(new ValidationPipe());

    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: configService.get<string>('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    const httpPort = configService.get<number>('PORT');

    await app.startAllMicroservicesAsync();
    await app.listen(httpPort);

    redisClient.on('error', async (error) => {
      await app.close();
      console.error(error);
      process.exit(1);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
