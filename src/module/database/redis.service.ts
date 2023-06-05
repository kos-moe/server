import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export default class RedisService {
  private clients: Array<Redis> = [];
  constructor(private Config: ConfigService) {}
  async db(no: number) {
    if (!this.clients[no]) {
      this.clients[no] = new Redis(this.Config.get('REDIS_URL'));
      await this.clients[no].select(no);
    }
    return this.clients[no];
  }
}
