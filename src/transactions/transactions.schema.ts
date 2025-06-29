import { BaseQuerySchemaBuilder } from '@src/common/schemas/base-query.schema';
import { z } from 'zod';

const orderList = ['date', 'createdAt', 'amount', 'type'] as const;

export const NewTransactionSchema = z.object({
  title: z
    .string({ required_error: 'Title is required', invalid_type_error: 'title should be a valid string' })
    .max(100, 'Title limit is 100 characters')
    .min(10, 'Title must be at least 10 characters length'),
  category: z.coerce
    .number({
      invalid_type_error: 'Category should be a valid number',
      required_error: 'Category ID is required',
    })
    .positive({ message: 'Category cannot be a negative value' }),
  amount: z.coerce.number().positive({ message: 'Please specify amout as a positive value' }),
  type: z.enum(['income', 'expense'], { message: 'Transaction type should be only as income or expense' }),
  description: z.string(),
  date: z
    .string({ required_error: 'Date is required', invalid_type_error: 'Date should be a string' })
    .date('Date should be a valid string date format'),
});

export const FilterTransactionSchema = BaseQuerySchemaBuilder.buildFilterSchema(orderList, {
  title: z.string().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  createdAfter: z.string().date().optional(),
  createdBefore: z.string().date().optional(),
  type: z.enum(['income', 'expense']).optional(),
  minAmount: z.coerce.number().optional(), //De la cantidad en adelante ejemplo: 200 >
  maxAmount: z.coerce.number().optional(), //De la cantidad para atrás: por ejemplo < 200 Y si vienen ambos 100 > y < 500
  category: z.coerce.number().optional(),
});

export const UpdateTransactionSchema = NewTransactionSchema.partial();
export const UpdateTransactionStatusSchema = z.object({ isActive: z.coerce.boolean() });

export type NewTransactionDto = z.infer<typeof NewTransactionSchema>;
export type FilterTransactionDto = z.infer<typeof FilterTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
export type UpdateTransactionStatusDto = z.infer<typeof UpdateTransactionStatusSchema>;
