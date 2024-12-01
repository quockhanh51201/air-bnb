import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get(ConfigService)
  const configSwagger = new DocumentBuilder()
    .setTitle("API AirBNB")
    .setDescription("Danh sách API AirBNB")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const swagger = SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup("Swagger", app, swagger)
  const port = configService.get<number>('PORT') || 3000
  await app.listen(port);
}
bootstrap();
