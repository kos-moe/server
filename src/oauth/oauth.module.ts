import { Module } from '@nestjs/common';
import InternalSessionModule from 'src/internal-session/internal-session.module';
import SessionModule from 'src/session/session.module';
import OAuthController from './oauth.controller';
import OAuthService from './oauth.service';
import OAuthTokenService from './oauth.token.service';

@Module({
  imports: [InternalSessionModule, SessionModule],
  controllers: [OAuthController],
  providers: [OAuthService, OAuthTokenService],
  exports: [OAuthService],
})
export default class OAuthModule {}
