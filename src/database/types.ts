import { users, profiles, sessions, categories, movements } from '@database/schema';

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

//MOVEMENTS
export type Movement = typeof movements.$inferSelect;
export type QueryMovementDefaults = QueryDefaults<keyof Pick<Movement, 'date' | 'createdAt' | 'amount' | 'type'>>;
export type QueryMovement = Partial<{
  startDate: Movement['date'];
  endDate: Movement['date'];
  title: Movement['title'];
  type: Movement['type'];
  minAmount: Movement['amount'];
  maxAmount: Movement['amount'];
  category: Movement['categoryId'];
  createdAfter: Movement['createdAt'];
  createdBefore: Movement['createdAt'];
  isActive: Movement['isActive'];
}> &
  QueryMovementDefaults;
export type NewMovement = typeof movements.$inferInsert;
export type UpdateMovement = Partial<Pick<NewMovement, 'amount' | 'categoryId' | 'date' | 'description' | 'title' | 'type'>>;
export type UpdateMovementStatus = Required<Pick<Movement, 'isActive'>>;
