import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../session/auth.guard';
import { CreateProfileDto } from './dto';
import ProfileService from './profile.service';

@Controller('profile')
export default class ProfileController {
  constructor(private profile: ProfileService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() { handle }: CreateProfileDto,
    @Request() { user: session },
  ) {
    const profile = await this.profile.create(handle, {
      accountId: session.accountId,
    });
    return { profile: profile.id };
  }
}
