import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq, InferModel } from 'drizzle-orm';
import { ulid } from 'ulid';
import AccountService from '../account/account.service';
import db from '../database/postgres';
import redis from '../database/redis';
import ProfileService from '../profile/profile.service';
import { sessions } from './session.schema';

type Session = InferModel<typeof sessions>;
type RedisSession = Omit<Omit<Session, 'id'>, 'expiresAt'> & {
  expiresAt: number;
};

@Injectable()
export default class SessionService {
  constructor(
    private account: AccountService,
    private profile: ProfileService,
  ) {}
  private async setCache(session: Session) {
    const { id, ...data } = {
      ...session,
      expiresAt: session.expiresAt.getTime(),
    };
    await redis.set(`session:${id}`, JSON.stringify(data));
    await redis.expire(`session:${id}`, 3600);
  }
  async create(
    accountId: string,
    appId: string,
    scope: string[],
    profileId?: string,
  ) {
    if (!(await this.account.get(accountId))) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    const profiles = await this.profile.getManyByAccount(accountId);
    const useProfile = profileId || profiles[0]?.id || null;
    const id = ulid();
    const session = (
      await db
        .insert(sessions)
        .values({
          id,
          accountId,
          appId,
          scope,
          profileId: useProfile ? useProfile : null,
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
