import { integer, pgTable, varchar, boolean, serial, timestamp, uuid, inet } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const profiles = pgTable('profiles', {
  idProfile: serial('id_profile').primaryKey().notNull(),
  name: varchar({ length: 50 }).notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  description: varchar({ length: 100 }).notNull().default('No Description'),
});

export const users = pgTable('users', {
  idUser: serial('id_user').primaryKey().notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 75 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  profileId: integer()
    .notNull()
    .references(() => profiles.idProfile),
});

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

export const profileRelations = relations(profiles, ({ many }) => ({
  users: many(users),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.profileId],
    references: [profiles.idProfile],
  }),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.idUser],
  }),
}));
