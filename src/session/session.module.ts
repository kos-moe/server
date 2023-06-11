import { Module } from '@nestjs/common';
import AccountModule from '../account/account.module';
import SessionController from './controller';
import SessionService from './session.service';

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [AccountModule],
  exports: [SessionService],
})
export default class SessionModule {}
