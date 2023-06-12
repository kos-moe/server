import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { config } from 'dotenv';

config();

const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: 'require' });
const migrateDB = drizzle(sql);

migrate(migrateDB, { migrationsFolder: 'drizzle' }).then(() => {
  console.log('Migration complete!');
  process.exit(0);
});
