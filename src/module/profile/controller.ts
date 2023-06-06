import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../auth/guard';
import { CreateProfileDto } from './dto';
import ProfileService from './service';

@Controller('profile')
export default class ProfileController {
  constructor(private profile: ProfileService) {}

  @UseGuards(AuthGuard())
  @Post()
  async create(@Body() { handle }: CreateProfileDto, @Request() { user }) {
    const profile = await this.profile.create(handle, {
      accountId: user.accountId,
    });
    return { profile: profile.id };
  }
}
