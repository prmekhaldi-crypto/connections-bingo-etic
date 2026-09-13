import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

let database: Database | undefined;

/**
 * Lazily create the Drizzle client so importing a route module never opens a
 * connection (important during `next build`).
 */
export function getDb(): Database {
  if (!database) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL is not set');
    }
    database = drizzle(postgres(url, { max: 5 }), { schema });
  }
  return database;
}
