import morgan from 'morgan';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const fastifyAdapter = new FastifyAdapter();

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      fastifyAdapter,
    );
    app.use(morgan('tiny'));
    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get<ConfigService>(ConfigService);

    const httpPort = configService.get<number>('PORT');

    // app.use(passport.initialize());
    // app.use(passport.session());

    const swaggerConfig = new DocumentBuilder()
      .setTitle('PopugJira Auth service')
      .setVersion('0.1')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger-api', app, swaggerDocument);

    await app.listen(httpPort, '0.0.0.0');
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
