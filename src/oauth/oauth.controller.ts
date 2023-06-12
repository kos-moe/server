import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import InternalSessionService from '../internal-session/internal-session.service';
import OAuthService from './oauth.service';

@Controller('oauth')
export default class OAuthController {
  constructor(
    private OAuth: OAuthService,
    private InternalSession: InternalSessionService,
  ) {}

  @Get('authorize')
  @Render('oauth-authorize')
  async authorize(
    @Req() request: Request,
    @Query('client_id') clientId: string,
    @Query('scope') scope: string,
    @Query('redirect_uri') redirectURI: string,
    @Res() response: Response,
  ) {
    const sessionId = request.cookies.session;
    if (!sessionId || !(await this.InternalSession.get(sessionId))) {
      return response.redirect('/login');
    }
    // TODO: 앱 정보 & CSRF 토큰 검증
    return { clientId, scope, redirectURI };
  }
  @Post('authorize')
  async authorizePost(
    @Req() request: Request,
    @Body('clientId') clientId: string,
    @Body('scope') scope: string,
    @Body('redirectURI') redirectURI: string,
    @Res() response: Response,
  ) {
    const sessionId = request.cookies.session;
    if (!sessionId || !(await this.InternalSession.get(sessionId))) {
      return response.redirect('/login');
    }
    const app = await this.OAuth.get(clientId);
    if (!app) {
      return response.redirect('/');
    }
    // TODO: 앱 Redirect URI 검증
    const token = await this.OAuth.authorize(
      sessionId,
      clientId,
      scope.split(' '),
    );
    return response.redirect(`${redirectURI}?token=${token}`);
  }

  @Post('token')
  async token(
    @Body('client_id') clientId: string,
    @Body('client_secret') clientSecret: string,
    @Body('code') code: string,
  ) {
    const result = await this.OAuth.token(code, clientId, clientSecret);
    return {
      session: result.session,
      scope: result.scope.join(' '),
    };
  }
}
