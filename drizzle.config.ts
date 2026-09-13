import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './apps/web/db/schema.ts',
  out: './apps/web/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://game_platform:game_platform@localhost:5432/game_platform',
  },
  verbose: true,
  strict: true,
});
