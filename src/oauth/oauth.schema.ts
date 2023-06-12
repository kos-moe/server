import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { id } from '../database/utils';

export const oAuthApps = pgTable('oauth_apps', {
  id: id().primaryKey(),
  name: varchar('name').notNull(),
  secret: varchar('secret').notNull(),
});

export const oAuthAppRedirectURI = pgTable('oauth_app_redirect_uris', {
  appId: id('app_id').references(() => oAuthApps.id),
  uri: varchar('uri').notNull(),
});
