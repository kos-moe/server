import { Global, Module } from '@nestjs/common';
import DatabaseService from './service';

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export default class DatabaseModule {}
