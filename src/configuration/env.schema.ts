import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  API_VERSION: z.string().default('1'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT Secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT Secret must be at least 32 characters'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  CONNECTION_URL: z.string().url(),
  FRONT_HTTP: z.string().url(),
});
