import { boolean, date, decimal, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { transactionType, users, categories } from './index';
import { relations } from 'drizzle-orm';

export const transactions = pgTable('transactions', {
  id: serial().primaryKey().notNull(),
  type: transactionType().notNull(),
  userId: integer()
    .notNull()
    .references(() => users.idUser),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  amount: decimal({ precision: 10, scale: 2 }),
  description: text(),
  date: date().notNull(),
  title: varchar({ length: 100 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  categoryId: integer()
    .notNull()
    .references(() => categories.idCategory),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.idCategory],
  }),
}));
