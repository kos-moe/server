import { Param, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../session/auth.guard';
import FollowService from './follow.service';

@Controller('profile/:id/')
export default class ProfileController {
  constructor(private Follow: FollowService) {}

  @UseGuards(AuthGuard)
  @Post('/follow')
  async create(@Param('id') id: string, @Request() { profileId }) {
    return await this.Follow.follow(profileId, id);
  }
}
