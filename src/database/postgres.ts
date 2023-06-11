import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { UpdateDeleteAction, char } from 'drizzle-orm/pg-core';
import { config } from 'dotenv';

config();

type FKType = {
  onUpdate: UpdateDeleteAction;
  onDelete: UpdateDeleteAction;
};

export const CASCADE: FKType = {
  onUpdate: 'cascade',
  onDelete: 'cascade',
};

export const id = (name = 'id') => char(name, { length: 26 });

const queryClient = postgres(process.env.DATABASE_URL);
const db: PostgresJsDatabase = drizzle(queryClient);
export default db;
