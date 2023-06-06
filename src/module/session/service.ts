import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ulid } from 'ulid';
import AccountService from '../account/service';
import { ConfigService } from '@nestjs/config';
import RedisService from '../database/redis.service';
import DatabaseService from '../database/db.service';
import { Session } from '@prisma/client';

@Injectable()
export default class SessionService {
  constructor(
    private account: AccountService,
    private config: ConfigService,
    private Redis: RedisService,
    private db: DatabaseService,
  ) {}
  private async setCache(session: Session) {
    const redis = await this.Redis.db(0);
    const { id, ...data } = session;
    await redis.set(id, JSON.stringify(data));
    await redis.expire(id, 3600);
  }
  async create(accountId: string) {
    const id = ulid();
    const session = await this.db.session.create({
      data: {
        id,
        accountId,
      },
    });

    this.setCache(session);

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
  async get(id: string): Promise<Session> {
    const redis = await this.Redis.db(0);

    const redisResult = await redis.get(id);
    if (redisResult) {
      return { id, ...JSON.parse(redisResult) };
    }
    const dbResult = await this.db.session.findUnique({
      where: {
        id,
      },
    });
    if (!dbResult) {
      throw new HttpException(null, HttpStatus.NOT_FOUND);
    }
    this.setCache(dbResult);
    return dbResult;
  }
}
