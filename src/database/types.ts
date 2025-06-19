import { users, profiles, sessions } from '@database/schema';

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
