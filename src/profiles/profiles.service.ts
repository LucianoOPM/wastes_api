import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schema';
import { FilterProfileDto, UpdateProfileDto, UpdateStatusDto } from '@profiles/profile.schema';
import { eq, SQL } from 'drizzle-orm';

@Injectable()
export class ProfilesService {
  constructor(@Inject('DRIZZLE') protected readonly db: NodePgDatabase<typeof schema>) {}

  async findProfileById(id: number) {
    return await this.db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.idProfile, id),
    });
  }

  async findByName(name: string) {
    return await this.db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.name, name),
    });
  }

  async createProfile(newProfile: schema.NewProfile) {
    const [profile] = await this.db.insert(schema.profiles).values(newProfile).returning();
    return profile;
  }

  async findAll(filter: FilterProfileDto) {
    return await this.db.query.profiles.findMany({
      where: (profiles, { and, eq }) => {
        const profileSql: SQL[] = [];

        if (filter.isActive !== undefined) {
          profileSql.push(eq(profiles.isActive, filter.isActive));
        }

        if (filter.name) {
          profileSql.push(eq(profiles.name, filter.name));
        }

        return and(...profileSql);
      },
      orderBy: (profiles, { asc, desc }) => {
        if (filter.order === 'asc') {
          return asc(profiles[filter.orderBy]);
        }
        if (filter.order === 'desc') {
          return desc(profiles[filter.orderBy]);
        }
        return asc(profiles.idProfile);
      },
      limit: filter.limit,
      offset: filter.page && filter.limit ? (filter.page - 1) * filter.limit : undefined,
    });
  }

  async update(idProfile: number, updateData: UpdateProfileDto) {
    const [profile] = await this.db
      .update(schema.profiles)
      .set(updateData)
      .where(eq(schema.profiles.idProfile, idProfile))
      .returning();
    return profile;
  }

  async updateStatus(idProfile: number, status: UpdateStatusDto) {
    const [profile] = await this.db
      .update(schema.profiles)
      .set(status)
      .where(eq(schema.profiles.idProfile, idProfile))
      .returning();
    return profile;
  }
}
