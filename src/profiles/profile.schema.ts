import { BaseQuerySchemaBuilder } from '@common/schemas/base-query.schema';
import { z } from 'zod';

const orderList = ['name', 'description', 'idProfile'] as const;

export const CreateProfileSchema = z
  .object({
    name: z
      .string({ required_error: 'Name property is required', invalid_type_error: 'Name should be an string' })
      .min(5, { message: 'Name should contain at least 5 characters' }),
    isActive: z.boolean({
      required_error: 'Is Active property is required',
      invalid_type_error: 'Is Active property should be an boolean',
    }),
    description: z
      .string({ required_error: 'Description is required', invalid_type_error: 'Description should be a string' })
      .nonempty({ message: 'Description should not be empty' })
      .min(10, { message: 'Description should contain at least 8 characters' })
      .max(100, { message: 'Description should be less than 100 characters' }),
  })
  .required();

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;
export const UpdateProfileSchema = CreateProfileSchema.omit({ isActive: true }).partial();
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export const UpdateStatusSchema = CreateProfileSchema.pick({ isActive: true });
export type UpdateStatusDto = z.infer<typeof UpdateStatusSchema>;

export const FilterProfileSchema = BaseQuerySchemaBuilder.buildFilterSchema(orderList, {
  name: z.string({ invalid_type_error: 'Name query should be a string' }).optional(),
  isActive: z.preprocess(
    (val) => {
      if (val === '1' || val === 1 || val === true) return true;
      if (val === '0' || val === 0 || val === false) return false;
      return val;
    },
    z.boolean({ invalid_type_error: 'Is Active should be a valid boolean' }).optional(),
  ),
});

export type FilterProfileDto = z.infer<typeof FilterProfileSchema>;
