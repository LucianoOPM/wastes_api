import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.CONNECTION_URL!,
  },
});
