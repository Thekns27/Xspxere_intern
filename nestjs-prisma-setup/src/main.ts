import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  const config = new DocumentBuilder()
    .setTitle('nestjs-prisma-setup API')
    .setDescription(
      'API documentation for our simple nestjs-prisma-setup application',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
   
  app.useGlobalPipes(
    new ValidationPipe({
      //     whitelist: true,
      //     forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
