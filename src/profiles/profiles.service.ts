import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schema';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('DRIZZLE') protected readonly db: NodePgDatabase<typeof schema>,
  ) {}
  findProfileById(id: number) {
    return this.db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.idProfile, id),
    });
  }
}
