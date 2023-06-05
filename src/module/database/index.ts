import { Global, Module } from '@nestjs/common';
import DatabaseService from './db.service';
import RedisService from './redis.service';

@Global()
@Module({
  providers: [DatabaseService, RedisService],
  exports: [DatabaseService, RedisService],
})
export default class DatabaseModule {}
