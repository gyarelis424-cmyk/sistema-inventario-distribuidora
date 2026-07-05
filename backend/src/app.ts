import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

export async function initializeApp() {
  const app = await NestFactory.create(AppModule);

  const rawCorsOrigin = process.env.CORS_ORIGIN;
  if (!rawCorsOrigin) {
    throw new Error('CORS_ORIGIN no está configurado. Debe apuntar al dominio exacto del frontend en Render.');
  }
  const allowedOrigins = rawCorsOrigin.split(',').map(origin => origin.trim());
  console.log(`[CORS] Orígenes permitidos: ${allowedOrigins.join(', ')}`);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  return app;
}