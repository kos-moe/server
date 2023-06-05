import { Module } from '@nestjs/common';
import AccountModule from '../account';
import SessionController from './controller';
import SessionService from './service';

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [AccountModule],
  exports: [SessionService],
})
export default class SessionModule {}
