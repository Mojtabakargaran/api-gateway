import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Security
  app.use(helmet());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Hospital Management Platform API Gateway')
    .setDescription('Central API Gateway for all microservices')
    .setVersion('1.0')
    .addTag('Health', 'Health check endpoints')
    .addTag('Proxy', 'Microservice proxy endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = configService.get('app.port', 3000);
  await app.listen(port);
  
  console.log(`API Gateway running on port ${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
