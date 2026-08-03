import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Configuración CORS para REST
  app.enableCors({
    origin: '*',
  });

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Indriver NestJS API')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // Render proporciona el puerto mediante process.env.PORT
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Servidor ejecutándose en el puerto ${port}`);
}

bootstrap();
