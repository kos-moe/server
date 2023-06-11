import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import redis from '../database/redis';

type InternalSession = {
  id: string;
  accountId: string;
};

@Injectable()
export default class InternalSessionService {
  async create(accountId: string) {
    const id = ulid();
    redis.set(`session:internal:${id}`, JSON.stringify({ accountId }));
    redis.expire(`session:internal:${id}`, 60 * 60 * 24);
    return id;
  }
  async get(id: string): Promise<InternalSession | null> {
    const sessionData = JSON.parse(
      (await redis.get(`session:internal:${id}`)) || null,
    );
    if (sessionData) {
      redis.expire(`session:internal:${id}`, 60 * 60 * 24);
      return { id, ...sessionData };
    }
    return null;
  }
}
