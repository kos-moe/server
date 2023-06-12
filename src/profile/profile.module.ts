import { Module } from '@nestjs/common';
import ProfileController from './profile.controller';
import ProfileService from './profile.service';
import FollowController from './follow.controller';
import FollowService from './follow.service';

@Module({
  controllers: [ProfileController, FollowController],
  providers: [ProfileService, FollowService],
  exports: [ProfileService, FollowService],
})
export default class ProfileModule {}
