import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { config } from 'dotenv';

config();

const queryClient = postgres(process.env.DATABASE_URL, { ssl: 'require' });
const db: PostgresJsDatabase = drizzle(queryClient);
export default db;
