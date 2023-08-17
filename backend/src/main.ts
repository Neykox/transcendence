import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());



  ///////////////////////////////////////////////
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  // }));
  ///////////////////////////////////////////////


  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
  });

  await app.listen(5000);
}
bootstrap();