import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import * as redis from 'redis';
import createRedisStore from 'connect-redis';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountingModule } from './accounting.module';

const RedisStore = createRedisStore(session);

async function bootstrap() {
  try {
    const redisClient = redis.createClient({
      prefix: 'accounting-service',
    });

    redisClient.on('error', (error) => {
      throw new Error(error);
    });

    const app = await NestFactory.create(AccountingModule);
    app.use(morgan('tiny'));
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
