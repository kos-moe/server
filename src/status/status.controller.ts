import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../session/auth.guard';
import { createStatusDto } from './status.dto';
import StatusService from './status.service';
import TimelineService from './timeline.service';

@Controller('statuses')
export default class StatusController {
  constructor(
    private Status: StatusService,
    private Timeline: TimelineService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() { profileId }, @Body() data: createStatusDto) {
    const id = await this.Timeline.write(profileId, data);
    return { id };
  }
}
