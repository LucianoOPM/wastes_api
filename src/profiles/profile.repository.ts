import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schema';
import type { NewProfile, UpdateProfile, UpdateProfileStatus } from '@database/types';
import { FilterProfileDto } from '@profiles/profile.schema';
import { eq, SQL, and } from 'drizzle-orm';

@Injectable()
export class ProfileRepository {
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

  async createProfile(newProfile: NewProfile) {
    const [profile] = await this.db.insert(schema.profiles).values(newProfile).returning();
    return profile;
  }

  async findAll(filter: FilterProfileDto) {
    const { isActive, name, order, orderBy, limit, page } = filter;

    const conditions: SQL[] = [];

    if (isActive !== undefined) {
      conditions.push(eq(schema.profiles.isActive, isActive));
    }

    if (name) {
      conditions.push(eq(schema.profiles.name, name));
    }
    const whereClause = conditions.length ? and(...conditions) : undefined;
    const [results, totalResult] = await Promise.all([
      this.db.query.profiles.findMany({
        where: whereClause,
        orderBy: (profiles, { asc, desc }) => (order === 'asc' ? asc(profiles[orderBy]) : desc(profiles[orderBy])),
        limit,
        offset: (page - 1) * limit,
      }),
      this.db.$count(schema.profiles, whereClause),
    ]);

    return {
      results,
      total: totalResult,
    };
  }

  async update(idProfile: number, updateData: UpdateProfile) {
    const [profile] = await this.db
      .update(schema.profiles)
      .set(updateData)
      .where(eq(schema.profiles.idProfile, idProfile))
      .returning();
    return profile;
  }

  async updateStatus(idProfile: number, status: UpdateProfileStatus) {
    const [profile] = await this.db
      .update(schema.profiles)
      .set(status)
      .where(eq(schema.profiles.idProfile, idProfile))
      .returning();
    return profile;
  }
}
