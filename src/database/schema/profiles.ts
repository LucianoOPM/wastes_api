import { integer, pgTable, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const profiles = pgTable('profiles', {
  idProfile: integer('id_profile').primaryKey().notNull(),
  name: varchar({ length: 50 }).notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
});

// Relación: un perfil puede estar en muchos usuarios
export const profileUsers = relations(profiles, ({ many }) => ({
  users: many(users),
}));
