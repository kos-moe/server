import { Module } from '@nestjs/common';
import DatabaseModule from './module/database';
import AuthModule from './module/auth';
import { ConfigModule } from '@nestjs/config';
import ProfileModule from './module/profile';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProfileModule,
  ],
})
export class CoreModule {}
