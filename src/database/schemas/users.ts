import { boolean, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { profiles, sessions } from './index';
import { relations } from 'drizzle-orm';

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

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.profileId],
    references: [profiles.idProfile],
  }),
  sessions: many(sessions),
}));
