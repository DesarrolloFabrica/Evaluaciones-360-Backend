import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para que el front pueda llamar al backend
  app.enableCors({
    origin: true,
    credentials: false,
  });

  // ⚠️ Cloud Run inyecta PORT=8080, en local puedes seguir usando 3001
  const port = Number(process.env.PORT) || 3001;

  // IMPORTANTE: escuchar en 0.0.0.0 para Cloud Run
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend escuchando en puerto ${port}`);
}

bootstrap();
