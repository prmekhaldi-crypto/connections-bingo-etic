import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 32 }).notNull().unique(),
  points: integer('points').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const plays = pgTable(
  'plays',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    gameId: varchar('game_id', { length: 64 }).notNull(),
    score: integer('score').notNull().default(0),
    bestScore: integer('best_score').notNull().default(0),
    playsCount: integer('plays_count').notNull().default(0),
    completed: boolean('completed').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('plays_user_game_unique').on(table.userId, table.gameId)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Play = typeof plays.$inferSelect;
export type NewPlay = typeof plays.$inferInsert;
