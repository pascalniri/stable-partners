import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global Prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Stable Partners API')
    .setDescription('The Stable Partners Property Management Consultancy API')
    .setVersion('1.0')
    .addTag('stable-partners')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar Reference
  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: http://localhost:3001/api`);
  console.log(`Documentation is available on: http://localhost:3001/docs`);
}
bootstrap();
