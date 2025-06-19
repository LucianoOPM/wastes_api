import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@database/schema';

export const databaseProvider = [
  {
    provide: 'DRIZZLE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const connectionUrl = configService.get<string>('database.connectionUri');
      const pool = new Pool({
        connectionString: connectionUrl,
      });
      const db = drizzle(pool, {
        schema,
      });
      return db;
    },
  },
];
