import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../session/auth.guard';
import TimelineService from './timeline.service';

@Controller('timeline')
export default class TimelineController {
  constructor(private Timeline: TimelineService) {}

  @Get('home')
  @UseGuards(AuthGuard)
  async getHomeTimeline(
    @Req() { profileId },
    @Query('cursor') cursor: string,
    @Query('limit') limit = 50,
  ) {
    return this.Timeline.getHomeTimeline(profileId, cursor, limit);
  }
}
