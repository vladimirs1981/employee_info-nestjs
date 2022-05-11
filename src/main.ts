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
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  await app.listen(3005);
}
bootstrap();
