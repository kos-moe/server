import { Module } from '@nestjs/common';
import AccountModule from 'src/account/account.module';
import MailerModule from 'src/mailer/mailer.module';
import InternalSessionService from './internal-session.service';
import LoginController from './login.controller';
import LoginService from './login.service';

@Module({
  imports: [AccountModule, MailerModule],
  providers: [InternalSessionService, LoginService],
  controllers: [LoginController],
  exports: [InternalSessionService],
})
export default class InternalSessionModule {}
