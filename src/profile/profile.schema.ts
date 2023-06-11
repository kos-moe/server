import { sql } from 'drizzle-orm';
import { pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { CASCADE, id } from '../database/utils';
import { accounts } from '../account/account.schema';

export const profiles = pgTable(
  'profiles',
  {
    id: id('id').primaryKey(),
    handle: id('handle').notNull(),
    accountId: id('account_id').references(() => accounts.id, CASCADE),
    name: id('name').notNull().default(''),
  },
  (table) => ({
    handleIdx: uniqueIndex('handle_idx')
      .on(table.handle)
      .using(sql`lower(${table.handle})`),
  }),
);
