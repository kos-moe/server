import { varchar, pgTable, json } from 'drizzle-orm/pg-core';
import { id } from '../database/postgres';

type AccountAuthenticator = {
  password?: string;
};

export const accounts = pgTable('accounts', {
  id: id('id').primaryKey(),
  name: varchar('name').notNull().default(''),
  authenticator: json('authenticator')
    .$type<AccountAuthenticator>()
    .notNull()
    .default({}),
});

export const accountEmails = pgTable('account_emails', {
  email: varchar('email').primaryKey(),
  accountId: id('account_id').references(() => accounts.id, {
    onUpdate: 'cascade',
    onDelete: 'cascade',
  }),
});
