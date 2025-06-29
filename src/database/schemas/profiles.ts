import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { users } from './index';

export const profiles = pgTable('profiles', {
  idProfile: serial('id_profile').primaryKey().notNull(),
  name: varchar({ length: 50 }).notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  description: varchar({ length: 100 }).notNull().default('No Description'),
});

export const profileRelations = relations(profiles, ({ many }) => ({
  users: many(users),
}));
