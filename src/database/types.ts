import { users, profiles, sessions, categories, transactions } from '@database/schemas';

export type QueryDefaults<TOrderBy extends string = string> = {
  limit: number;
  page: number;
  orderBy: TOrderBy;
  order: 'asc' | 'desc';
};
//USERS
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UpdateUser = Partial<Omit<NewUser, 'email' | 'isActive' | 'idUser'>>;
export type UpdateUserStatus = Required<Pick<NewUser, 'isActive'>>;

//PROFILES
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type UpdateProfile = Partial<Omit<NewProfile, 'isActive' | 'idProfile'>>;
export type UpdateProfileStatus = Required<Pick<NewProfile, 'isActive'>>;

//SESSIONS
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type UpdateSessionStatus = Required<Pick<NewSession, 'isValid'>>;

//CATEGORIES
export type Category = typeof categories.$inferSelect;
export type QueryCategoryDefaults = QueryDefaults<keyof Pick<Category, 'name'>>;
export type QueryCategory = Partial<{
  name: Category['name'];
  isActive: Category['isActive'];
}> &
  QueryCategoryDefaults;
export type NewCategory = typeof categories.$inferInsert;
export type UpdateCategory = Partial<Omit<Category, 'idCategory' | 'isActive'>>;
export type UpdateCategoryStatus = Required<Pick<Category, 'isActive'>>;

//TRANSACTIONS
export type Transactions = typeof transactions.$inferSelect;
export type QueryTransactionsDefaults = QueryDefaults<keyof Pick<Transactions, 'date' | 'createdAt' | 'amount' | 'type'>>;
export type QueryTransactions = Partial<{
  startDate: Transactions['date'];
  endDate: Transactions['date'];
  title: Transactions['title'];
  type: Transactions['type'];
  minAmount: Transactions['amount'];
  maxAmount: Transactions['amount'];
  category: Transactions['categoryId'];
  createdAfter: Transactions['createdAt'];
  createdBefore: Transactions['createdAt'];
  isActive: Transactions['isActive'];
}> &
  QueryTransactionsDefaults;
export type NewTransaction = typeof transactions.$inferInsert;
export type UpdateTransaction = Partial<Pick<NewTransaction, 'amount' | 'categoryId' | 'date' | 'description' | 'title' | 'type'>>;
export type UpdateTransactionStatus = Required<Pick<Transactions, 'isActive'>>;
