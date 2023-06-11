import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import AccountModule from '../account/account.module';
import SessionModule from '../session/session.module';
import AuthService from './service';
import BearerStrategy from './bearer.strategy';

@Global()
@Module({
  providers: [AuthService, BearerStrategy],
  imports: [AccountModule, SessionModule, PassportModule],
  exports: [AuthService],
})
export default class AuthModule {}
