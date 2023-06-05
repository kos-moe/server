import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import DatabaseService from '../database/service';
import { ulid } from 'ulid';
import AccountService from '../account/service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class SessionService {
  constructor(
    private db: DatabaseService,
    private account: AccountService,
    private config: ConfigService,
  ) {}
  async create(accountId: string) {
    const session = await this.db.session.create({
      data: {
        id: ulid(),
        accountId,
      },
    });
    return session;
  }
  async createFromToken(token: string) {
    console.log(
      JSON.stringify({
        token,
        clientId: this.config.get('OAUTH_CLIENT_ID'),
        clientSecret: this.config.get('OAUTH_CLIENT_SECRET'),
      }),
    );
    const session = await fetch('https://id.kos.moe/api/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        token,
        clientId: this.config.get('OAUTH_CLIENT_ID'),
        clientSecret: this.config.get('OAUTH_CLIENT_SECRET'),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new HttpException(null, HttpStatus.UNAUTHORIZED);
        return res.json();
      })
      .then((data) => {
        return data.session as string;
      });
    const account = await fetch('https://id.kos.moe/api/account', {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new HttpException(null, HttpStatus.UNAUTHORIZED);
        return res.json();
      })
      .then((data) => {
        return this.account.upsert(data.id, data.name);
      });
    return await this.create(account.id);
  }
}
