import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('FRONT_END_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const port = configService.get('PORT');
  await app.listen(port);
  Logger.log(`Server running on port ${port}`, 'Main');
}
bootstrap();
