import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
