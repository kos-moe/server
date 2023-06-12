import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import OAuthModule from './oauth/oauth.module';
import ProfileModule from './profile/profile.module';
import StatusModule from './status/status.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProfileModule,
    OAuthModule,
    StatusModule,
  ],
})
export class CoreModule {}
