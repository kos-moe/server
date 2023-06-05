import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import DatabaseService from '../database/service';

@Injectable()
export default class AccountService {
  constructor(private db: DatabaseService) {}
  async upsert(id: string, name: string) {
    const user = await this.db.account.upsert({
      where: {
        id,
      },
      update: {
        name,
      },
      create: {
        id,
        name,
      },
    });
    return user;
  }
  async get(id: string) {
    const user = await this.db.account.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException(null, HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
