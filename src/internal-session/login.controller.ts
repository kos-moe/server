import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import AccountService from '../account/account.service';
import InternalSessionService from './internal-session.service';
import { CreateAccountDto } from './login.dto';
import LoginService from './login.service';

@Controller()
export default class LoginController {
  constructor(
    private Login: LoginService,
    private Account: AccountService,
    private InternalSession: InternalSessionService,
  ) {}
  @Get('login')
  @Render('login')
  loginPage() {
    return {};
  }
  @Post('login')
  async login(
    @Body() body: CreateAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('session', await this.Login.login(body.email, body.password), {
      httpOnly: true,
    });
  }
  @Get('register/mail')
  @Render('register-mail')
  MailVerificationPage() {
    return {};
  }
  @Post('register/mail')
  async sendVerificationEmail(@Body() body: CreateAccountDto) {
    const { resendTime } = await this.Login.sendVerificationEmail(body.email);
    return { resendTime };
  }
  @Get('register')
  @Render('register')
  RegisterPage(@Query('email') email: string, @Query('code') code: string) {
    return { email, code };
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
