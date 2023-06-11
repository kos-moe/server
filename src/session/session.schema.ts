import { sql } from 'drizzle-orm';
import { json, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { CASCADE, id } from '../database/utils';
import { accounts } from '../account/account.schema';
import { oAuthApps } from '../oauth/oauth.schema';

export const sessions = pgTable('sessions', {
  id: id('id').primaryKey(),
  accountId: id('account_id')
    .notNull()
    .references(() => accounts.id, CASCADE),
  expiresAt: timestamp('expires_at')
    .notNull()
    .default(sql`now() + interval '7 day'`),
  appId: id('app_id').references(() => oAuthApps.id, CASCADE),
  scope: json('scope').notNull().default([]).$type<string[]>(),
});
