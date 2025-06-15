import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from './schema/users';
import { profiles } from './schema/profiles';

export const databaseProvider = [
  {
    provide: 'DRIZZLE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const connectionUrl = configService.get<string>('connectionUrl');
      const pool = new Pool({
        connectionString: connectionUrl,
      });
      const db = drizzle({
        client: pool,
        schema: { users, profiles },
      });
      return db;
    },
  },
];
