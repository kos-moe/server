import { Module } from '@nestjs/common';
import DatabaseModule from './module/database';
import SessionModule from './module/session';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    SessionModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class CoreModule {}
