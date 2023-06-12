import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import InternalSessionModule from './internal-session/internal-session.module';
import OAuthModule from './oauth/oauth.module';
import ProfileModule from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProfileModule,
    InternalSessionModule,
    OAuthModule,
  ],
})
export class CoreModule {}
