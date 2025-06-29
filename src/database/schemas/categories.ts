import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { transactions } from './index';

export const categories = pgTable('categories', {
  idCategory: serial('id_category').primaryKey().notNull(),
  name: varchar({ length: 50 }).notNull().unique(),
  description: text(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));
