import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);



  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Site de Rencontre V1.0.0')
    .setDescription('Documentation des APIs pour le site de rencontre')
    .setVersion('1.0')
    .addBearerAuth() // Pour la documentation de l'authentification JWT
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
