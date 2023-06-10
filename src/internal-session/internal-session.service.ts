import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import redis from '../database/redis';

@Injectable()
export default class InternalSessionService {
  async create(accountId: string) {
    const id = ulid();
    redis.set(`session:internal:${id}`, JSON.stringify({ accountId }));
    redis.expire(`session:internal:${id}`, 60 * 60 * 24);
    return id;
  }
  async get(id: string) {
    return JSON.parse((await redis.get(`session:internal:${id}`)) || null);
  }
}
