import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { CoreModule } from './core.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(CoreModule);
  app.use(cookieParser());
  app.setBaseViewsDir(join('src', 'views'));
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
