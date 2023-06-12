import { pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { CASCADE, id } from '../database/utils';
import { profiles } from './profile.schema';

export const follows = pgTable(
  'follows',
  {
    followerId: id('follower_id')
      .notNull()
      .references(() => profiles.id, CASCADE),
    followingId: id('following_id')
      .notNull()
      .references(() => profiles.id, CASCADE),
  },
  (table) => ({
    pk: primaryKey(table.followerId, table.followingId),
  }),
);
