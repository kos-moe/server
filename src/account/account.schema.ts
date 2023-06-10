import { char, varchar, pgTable, json } from 'drizzle-orm/pg-core';

type AccountAuthenticator = {
  password?: string;
};

export const accounts = pgTable('accounts', {
  id: char('id', { length: 26 }).primaryKey(),
  name: varchar('name').notNull().default(''),
  authenticator: json('authenticator')
    .$type<AccountAuthenticator>()
    .notNull()
    .default({}),
});

export const accountEmails = pgTable('account_emails', {
  email: varchar('email').primaryKey(),
  accountId: char('account_id', { length: 26 }).references(() => accounts.id, {
    onUpdate: 'cascade',
    onDelete: 'cascade',
  }),
});
