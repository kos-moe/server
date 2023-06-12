import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import db from '../database/postgres';
import { profiles } from './profile.schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export default class ProfileService {
  constructor() {}
  async get(id: string) {
    const result = await db.select().from(profiles).where(eq(profiles.id, id));
    return result[0];
  }
  async getByHandle(handle: string) {
    const result = await db
      .select()
      .from(profiles)
      .where(sql`lower(${profiles.handle}) = lower(${handle})`);
    return result[0];
  }
  async getManyByAccount(accountId: string) {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.accountId, accountId));
    return result;
  }
  async create(
    handle: string,
    { accountId, name }: { accountId?: string; name?: string } = {},
  ) {
    if (!handle.match(/^[a-zA-Z0-9_]{1,32}$/)) {
      throw new HttpException('Invalid handle', HttpStatus.BAD_REQUEST);
    }
    if (await this.getByHandle(handle)) {
      throw new HttpException('Handle already exists', HttpStatus.CONFLICT);
    }
    const profile = await db
      .insert(profiles)
      .values({
        id: ulid(),
        handle,
        accountId: accountId || null,
        name: name || handle,
      })
      .returning();
    return profile[0];
  }
}
