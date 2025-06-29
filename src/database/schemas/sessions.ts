import { boolean, inet, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './index';
import { relations } from 'drizzle-orm';

export const sessions = pgTable('sessions', {
  idSession: uuid('id_session').primaryKey().notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.idUser),
  userAgent: varchar('user_agent', { length: 300 }).notNull(),
  ipAdress: inet('ip_adress').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isValid: boolean('is_valid').default(true).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.idUser],
  }),
}));
