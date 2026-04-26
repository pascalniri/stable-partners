import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: INestApplication;
const server = express();

export async function bootstrap(expressInstance = server) {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
    );

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://stable-partners-api.vercel.app',
        /\.vercel\.app$/, // Allow all vercel subdomains
      ],
      credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Stable Partners API')
      .setDescription('The Stable Partners Property Management Consultancy API')
      .setVersion('1.0')
      .addTag('stable-partners')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    app.use('/docs', apiReference({ content: document }));

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(async (app) => {
    await app.listen(process.env.PORT ?? 3001);
    console.log(`🚀 API running on: http://localhost:3001/api`);
  });
}

// For Vercel Serverless
export default async (req: any, res: any) => {
  await bootstrap(server);
  server(req, res);
};
