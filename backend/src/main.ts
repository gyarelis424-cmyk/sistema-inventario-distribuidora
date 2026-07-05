import { initializeApp } from './app';

async function bootstrap() {
  const app = await initializeApp();
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on http://localhost:${port}`);
}

bootstrap();
