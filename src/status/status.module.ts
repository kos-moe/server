import { Module } from '@nestjs/common';
import ProfileModule from '../profile/profile.module';
import SessionModule from '../session/session.module';
import StatusController from './status.controller';
import StatusService from './status.service';
import TimelineController from './timeline.controller';
import TimelineService from './timeline.service';

@Module({
  imports: [ProfileModule, SessionModule],
  providers: [StatusService, TimelineService],
  controllers: [TimelineController, StatusController],
  exports: [StatusService, TimelineService],
})
export default class StatusModule {}
