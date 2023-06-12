import { pgTable, text } from 'drizzle-orm/pg-core';
import { profiles } from '../profile/profile.schema';
import { CASCADE, id } from '../database/utils';

export const statuses = pgTable('statuses', {
  id: id().primaryKey(),
  profileId: id('profile_id')
    .notNull()
    .references(() => profiles.id, CASCADE),
  content: text('content').notNull(),
});
