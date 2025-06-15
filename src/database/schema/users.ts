import { relations } from 'drizzle-orm';
import { pgTable, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const users = pgTable('users', {
  idUser: integer('id_user').primaryKey().notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 75 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  profileId: integer()
    .references(() => profiles.idProfile)
    .notNull(),
});

// Relación: un usuario tiene un perfil
export const userProfile = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.profileId],
    references: [profiles.idProfile],
  }),
}));
