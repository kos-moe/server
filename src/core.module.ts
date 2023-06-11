import { Module } from '@nestjs/common';
//import AuthModule from './auth';
import { ConfigModule } from '@nestjs/config';
import InternalSessionModule from './internal-session/internal-session.module';
import OAuthModule from './oauth/oauth.module';
//import ProfileModule from './profile';

@Module({
  imports: [
    //AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    //ProfileModule,
    InternalSessionModule,
    OAuthModule,
  ],
})
export class CoreModule {}
