if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configSwagger = new DocumentBuilder()
    .setTitle('Employee Info Api with NestJS')
    .setDescription('Employee Info Api developed using NodeJS framework NestJS, Postgres database and TypeORM.')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExLCJlbWFpbCI6InZsYWRpbWlyLnN0b2phbm92aWNAcXVhbnRveC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTIzNTA1OTR9.a5L-SDLTo9pSKrmlye7250wbel3eM1yZjNhaQ4yvxQo',
        },
      },
    },
  };
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document, options);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  await app.listen(3005);
}
bootstrap();
