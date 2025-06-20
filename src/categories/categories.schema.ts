import { BaseQuerySchemaBuilder } from '@common/schemas/base-query.schema';
import { z } from 'zod';

const orderList = ['name'] as const;

export const CreateCategorySchema = z.object({
  name: z
    .string({ required_error: 'name is required', invalid_type_error: 'Name must be a string' })
    .max(50, { message: 'Max length for name is 50 characters' }),
  description: z.string({ required_error: 'description is required' }),
  isActive: z.coerce.boolean(),
});
export const FilterCategorySchema = BaseQuerySchemaBuilder.buildFilterSchema(
  orderList,
  BaseQuerySchemaBuilder.withIsActiveFilter({
    name: z.string().optional(),
  }),
);

export const UpdateCategorySchema = CreateCategorySchema.omit({ isActive: true });
export const UpdateCategoryStatusSchema = CreateCategorySchema.pick({ isActive: true });

export type NewCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
export type UpdateCategoryStatusDto = z.infer<typeof UpdateCategoryStatusSchema>;
export type FilterCategoryDto = z.infer<typeof FilterCategorySchema>;
