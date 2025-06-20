import { z } from 'zod';
import { BaseQuerySchemaBuilder } from '@common/schemas/base-query.schema';

const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'g');
const orderList = ['email', 'firstName', 'lastName', 'idUser'] as const;

export const CreateUserSchema = z
  .object({
    email: z.string({ required_error: 'Email is required' }).email({ message: 'Email must be a valid email address' }).nonempty({
      message: 'Email is required and must be a valid email address',
    }),
    password: z.string({ required_error: 'Password is required' }).regex(passwordRegex, {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
    }),
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(2, { message: 'First name must be at least 2 characters long' }),
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(2, { message: 'Last name must be at least 2 characters long' }),
    isActive: z.coerce.boolean(),
    profileId: z
      .number({ required_error: 'Profile ID is required' })
      .int({ message: 'Profile ID must be an integer' })
      .positive({ message: 'Profile ID must be a positive integer' }),
  })
  .required();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.omit({ email: true, isActive: true }).partial();
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export const UpdateStatusSchema = CreateUserSchema.pick({ isActive: true });
export type UpdateStatusDto = z.infer<typeof UpdateStatusSchema>;

export const FilterUserSchema = BaseQuerySchemaBuilder.buildFilterSchema(orderList, {
  profileId: z.coerce
    .number({ invalid_type_error: 'Profile ID should be a number' })
    .int({ message: 'Profile ID should be an integer' })
    .optional(),
  email: z.string({ message: 'Email should be a string' }).email({ message: 'Email should be a valid format' }).optional(),
  firstName: z.string({ message: 'Fist name should be a valid string' }).optional(),
  lastName: z.string({ message: 'Fist name should be a valid string' }).optional(),
  isActive: z.preprocess(
    (val) => {
      if (val === '1' || val === 1 || val === true) return true;
      if (val === '0' || val === 0 || val === false) return false;
      return val;
    },
    z.boolean({ invalid_type_error: 'Is Active should be a valid boolean' }).optional(),
  ),
});

export type FilterUserDto = z.infer<typeof FilterUserSchema>;
