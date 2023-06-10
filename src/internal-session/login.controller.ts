import { Body, Controller, Post, Res } from '@nestjs/common';
import AccountService from '../account/account.service';
import { CreateAccountDto } from './login.dto';
import LoginService from './login.service';
import { Response } from 'express';
import InternalSessionService from './internal-session.service';

@Controller()
export default class LoginController {
  constructor(
    private Login: LoginService,
    private Account: AccountService,
    private InternalSession: InternalSessionService,
  ) {}
  @Post('login')
  async login(
    @Body() body: CreateAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('session', await this.Login.login(body.email, body.password), {
      httpOnly: true,
    });
  }
  @Post('mail-verification')
  async sendVerificationEmail(@Body() body: CreateAccountDto) {
    const { resendTime } = await this.Login.sendVerificationEmail(body.email);
    return { resendTime };
  }
  @Post('register')
  async createAccount(
    @Body() body: CreateAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.Login.checkVerificationCode(body.email, body.verificationCode);
    const account = await this.Account.create(
      body.email,
      body.password,
      body.name,
    );
    res.cookie('session', await this.InternalSession.create(account.id), {
      httpOnly: true,
    });
  }
}
