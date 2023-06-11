import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import InternalSessionService from '../internal-session/internal-session.service';
import db from '../database/postgres';
import { oAuthApps } from './oauth.schema';
import { eq, InferModel } from 'drizzle-orm';
import OAuthTokenService from './oauth.token.service';
import { verify } from '@node-rs/argon2';
import SessionService from 'src/session/session.service';

@Injectable()
export default class OAuthService {
  constructor(
    private InternalSession: InternalSessionService,
    private OAuthToken: OAuthTokenService,
    private Session: SessionService,
  ) {}
  async get(id: string): Promise<InferModel<typeof oAuthApps> | undefined> {
    const result = await db
      .select()
      .from(oAuthApps)
      .where(eq(oAuthApps.id, id));
    return result[0];
  }
  async authorize(sessionId: string, clientId: string, scope: Array<string>) {
    const session = await this.InternalSession.get(sessionId);
    if (!session) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const app = await this.get(clientId);
    if (!app) {
      throw new HttpException('Invalid app', HttpStatus.FORBIDDEN);
    }
    const token = await this.OAuthToken.create({
      accountId: session.accountId,
      appId: clientId,
      scope,
    });
    return token;
  }
  async token(code: string, clientId: string, clientSecret: string) {
    const token = await this.OAuthToken.get(code);
    if (!token || token.appId !== clientId) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const app = await this.get(clientId);
    if (!app || !(await verify(app.secret, clientSecret))) {
      throw new HttpException('Invalid app', HttpStatus.UNAUTHORIZED);
    }
    const session = await this.Session.create(
      token.accountId,
      clientId,
      token.scope,
    );
    await this.OAuthToken.delete(code);
    return { session: session.id, scope: token.scope };
  }
}
