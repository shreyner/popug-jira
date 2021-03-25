import session from 'express-session';
import passport from 'passport';
import createRedisStore from 'connect-redis';
import * as redis from 'redis';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Listener } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { AppModule } from './app.module';
import { CustomStrategy } from '@nestjs/microservices';

const RedisStore = createRedisStore(session);

async function bootstrap() {
  try {
    const redisClient = redis.createClient({
      prefix: 'task-tracker-service',
    });
    redisClient.on('error', (error) => {
      throw new Error(error);
    });

    const optionsMicroservice: CustomStrategy = {
      strategy: new Listener(
        'test-cluster',
        'task-tracker-service-listener',
        'task-tracker-service-group',
        {
          url: 'http://localhost:4222',
        },
        {
          durableName: 'task-tracker-service-group',
          manualAckMode: true,
          deliverAllAvailable: true,
        },
      ),
    };

    const app = await NestFactory.create(AppModule);

    app.connectMicroservice(optionsMicroservice);

    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get<ConfigService>(ConfigService);

    const httpPort = configService.get<number>('PORT');

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

    await app.startAllMicroservicesAsync();

    await app.listen(httpPort);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
