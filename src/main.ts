import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 🔹 Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Indriver NestJS API')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth() // JWT para proteger mis endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
