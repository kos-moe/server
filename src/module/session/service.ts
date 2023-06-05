import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ulid } from 'ulid';
import AccountService from '../account/service';
import { ConfigService } from '@nestjs/config';
import RedisService from '../database/redis.service';

@Injectable()
export default class SessionService {
  constructor(
    private account: AccountService,
    private config: ConfigService,
    private Redis: RedisService,
  ) {}
  async create(accountId: string) {
    const sessionId = ulid();
    const redis = await this.Redis.db(0);
    await redis.set(sessionId, JSON.stringify({ accountId }));
    await redis.expire(sessionId, 60 * 60 * 24 * 7);
    return sessionId;
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
  async get(id: string) {
    const redis = await this.Redis.db(0);
    return JSON.parse(await redis.get(id));
  }
}
