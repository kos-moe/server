import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import redis from '../database/redis';

type OAuthToken = {
  accountId: string;
  appId: string;
  scope: Array<string>;
};

@Injectable()
export default class OAuthTokenService {
  async get(id: string): Promise<OAuthToken | null> {
    const result = await redis.get(`oauthtoken:${id}`);
    if (!result) {
      return null;
    }
    return JSON.parse(result) as OAuthToken;
  }
  async create(data: OAuthToken) {
    const id = ulid();
    await redis.set(`oauthtoken:${id}`, JSON.stringify(data));
    await redis.expire(id, 300);
    return id;
  }
  async delete(id: string) {
    await redis.del(`oauthtoken:${id}`);
  }
}
