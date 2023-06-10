import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { UpdateDeleteAction } from 'drizzle-orm/pg-core';

type FKType = {
  onUpdate: UpdateDeleteAction;
  onDelete: UpdateDeleteAction;
};

export const CASCADE: FKType = {
  onUpdate: 'cascade',
  onDelete: 'cascade',
};

const queryClient = postgres(process.env.DATABASE_URL);
const db: PostgresJsDatabase = drizzle(queryClient);
export default db;
