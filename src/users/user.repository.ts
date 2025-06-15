import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schema';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }
}
