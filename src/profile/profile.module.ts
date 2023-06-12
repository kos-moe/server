import { forwardRef, Module } from '@nestjs/common';
import ProfileController from './profile.controller';
import ProfileService from './profile.service';
import FollowController from './follow.controller';
import FollowService from './follow.service';
import SessionModule from 'src/session/session.module';

@Module({
  imports: [forwardRef(() => SessionModule)],
  controllers: [ProfileController, FollowController],
  providers: [ProfileService, FollowService],
  exports: [ProfileService, FollowService],
})
export default class ProfileModule {}
