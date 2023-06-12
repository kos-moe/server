import { forwardRef, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import AccountModule from '../account/account.module';
import ProfileModule from '../profile/profile.module';
import SessionController from './controller';
import SessionService from './session.service';

@Module({
  controllers: [SessionController],
  providers: [SessionService, AuthGuard],
  imports: [AccountModule, forwardRef(() => ProfileModule)],
  exports: [SessionService],
})
export default class SessionModule {}
