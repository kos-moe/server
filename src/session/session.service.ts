import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import AccountService from '../account/account.service';
import { ConfigService } from '@nestjs/config';
import redis from '../database/redis';
import db from '../database/postgres';
import { sessions } from './session.schema';
import { eq, InferModel } from 'drizzle-orm';

type Session = InferModel<typeof sessions>;
type RedisSession = Omit<Omit<Session, 'id'>, 'expiresAt'> & {
  expiresAt: number;
};

@Injectable()
export default class SessionService {
  constructor(private account: AccountService, private config: ConfigService) {}
  private async setCache(session: Session) {
    const { id, ...data } = {
      ...session,
      expiresAt: session.expiresAt.getTime(),
    };
    await redis.set(`session:${id}`, JSON.stringify(data));
    await redis.expire(`session:${id}`, 3600);
  }
  async create(accountId: string, appId: string, scope: string[]) {
    const id = ulid();
    const session = (
      await db
        .insert(sessions)
        .values({
          id,
          accountId,
          appId,
          scope,
        })
        .returning()
    )[0];

    this.setCache(session);

    return session;
  }
  async get(id: string): Promise<Session> {
    const redisResult = JSON.parse(
      (await redis.get(`session:${id}`)) || null,
    ) as RedisSession;
    if (redisResult) {
      await redis.expire(`session:${id}`, 3600);
      return { id, ...redisResult, expiresAt: new Date(redisResult.expiresAt) };
    }
    const dbResult = (
      await db.select().from(sessions).where(eq(sessions.id, id))
    )[0];
    if (!dbResult) {
      return null;
    }
    this.setCache(dbResult);
    return dbResult;
  }
}
