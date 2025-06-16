import { integer, pgTable, varchar, boolean, serial } from 'drizzle-orm/pg-core';
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
    .references(() => profiles.idProfile)
    .notNull(),
});

export const profileUsers = relations(profiles, ({ many }) => ({
  users: many(users),
}));

export const userProfile = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.profileId],
    references: [profiles.idProfile],
  }),
}));
