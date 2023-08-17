import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
  });
  
  // app.enableCors({
  //   origin: '*',
  //   allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  //   methods: 'GET, POST, PUT, DELETE, OPTIONS',
  // });

  await app.listen(5000);
}
bootstrap();