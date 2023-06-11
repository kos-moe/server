import { Controller, Post, Body } from '@nestjs/common';
import { CreateSessionDto } from './dto';
import SessionService from './session.service';

@Controller('session')
export default class SessionController {
  constructor(private session: SessionService) {}
  // @Post()
  // async create(@Body() { token }: CreateSessionDto) {
  //   return { session: (await this.session.createFromToken(token)).id };
  // }
}
