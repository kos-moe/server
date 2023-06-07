import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import DatabaseService from '../database/db.service';

@Injectable()
export default class ProfileService {
  constructor(private db: DatabaseService) {}
  async create(
    handle: string,
    { accountId, name }: { accountId?: string; name?: string } = {},
  ) {
    if (!handle.match(/^[a-zA-Z0-9_]{1,32}$/))
      throw new HttpException('Invalid handle', HttpStatus.BAD_REQUEST);
    if (
      accountId &&
      !(await this.db.account.findUnique({
        where: {
          id: accountId,
        },
      }))
    )
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    if (await this.db.profile.findUnique({ where: { handle } }))
      throw new HttpException('Profile already exists', HttpStatus.CONFLICT);
    const profile = await this.db.profile.create({
      data: {
        id: ulid(),
        handle,
        accountId: accountId || null,
        name: name || handle,
      },
    });
    return profile;
  }
}
