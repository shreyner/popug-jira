import * as session from 'express-session';
import * as passport from 'passport';
import * as createRedisStore from 'connect-redis';
import * as redis from 'redis';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

const RedisStore = createRedisStore(session);

async function bootstrap() {
  try {
    const redisClient = redis.createClient({
      prefix: 'task-tracker-service',
    });
    redisClient.on('error', (error) => {
      throw new Error(error);
    });

    const app = await NestFactory.create(AppModule);
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

    await app.listen(httpPort);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
