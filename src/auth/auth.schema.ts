import { z } from 'zod';

export const CreateSessionSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
  keepSession: z.coerce.boolean(),
});

export type CreateSessionDto = z.infer<typeof CreateSessionSchema>;
