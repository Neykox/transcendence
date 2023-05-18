import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:3000"]
  });
  
  // app.enableCors({
  //   origin: '*',
  //   allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  //   methods: 'GET, POST, PUT, DELETE, OPTIONS',
  // });

  await app.listen(5000);
}
bootstrap();