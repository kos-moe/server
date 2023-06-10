import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import db from '../database/postgres';
import redis from '../database/redis';
import { accountEmails, accounts } from './account.schema';
import { hash } from '@node-rs/argon2';
import { ulid } from 'ulid';
import { eq } from 'drizzle-orm';

@Injectable()
export default class AccountService {
  async create(email: string, password: string, name: string) {
    const existedAccountEmails = await db
      .select()
      .from(accountEmails)
      .where(eq(accountEmails.email, email));
    if (existedAccountEmails.length) {
      throw new HttpException(null, HttpStatus.CONFLICT);
    }
    const id = ulid();
    return await db.transaction(async (tx) => {
      const user = await tx
        .insert(accounts)
        .values({
          id,
          name: name,
          authenticator: {
            password: await hash(password),
          },
        })
        .returning();
      await tx.insert(accountEmails).values({ email: email, accountId: id });
      await redis.del(`email:verification:${email}`);
      return user[0];
    });
  }

  async get(id: string) {
    const account = await db.select().from(accounts).where(eq(accounts.id, id));
    if (!account.length) throw new HttpException(null, HttpStatus.NOT_FOUND);
    return account[0];
  }
  async getFromEmail(email: string) {
    const result = await db
      .select({ accounts })
      .from(accounts)
      .leftJoin(accountEmails, eq(accounts.id, accountEmails.accountId))
      .where(eq(accountEmails.email, email));
    if (!result.length) throw new HttpException(null, HttpStatus.NOT_FOUND);
    return result[0].accounts;
  }
}
