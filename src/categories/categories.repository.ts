import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schema';
import { NewCategory, UpdateCategory, UpdateCategoryStatus, QueryCategory } from '@database/types';
import { and, eq, SQL } from 'drizzle-orm';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject('DRIZZLE') protected readonly db: NodePgDatabase<typeof schema>) {}

  async create(newCategory: NewCategory) {
    return await this.db.insert(schema.categories).values(newCategory).returning();
  }

  async getById(id: number) {
    return await this.db.query.categories.findFirst({ where: (categories, { eq }) => eq(categories.idCategory, id) });
  }

  async getAll(filter: QueryCategory) {
    const { isActive, name, order, orderBy, limit, page } = filter;
    const conditions: SQL[] = [];
    if (isActive !== undefined) conditions.push(eq(schema.categories.isActive, isActive));
    if (name) conditions.push(eq(schema.categories.name, name));

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [results, total] = await Promise.all([
      await this.db.query.categories.findMany({
        where: whereClause,
        orderBy: (categories, { asc, desc }) => (order === 'asc' ? asc(categories[orderBy]) : desc(categories[orderBy])),
        limit,
        offset: (page - 1) * limit,
      }),
      await this.db.$count(schema.categories, whereClause),
    ]);

    return {
      results,
      total,
    };
  }

  async getByName(name: string) {
    return await this.db.query.categories.findFirst({ where: (categories, { eq }) => eq(categories.name, name) });
  }

  async update(id: number, data: UpdateCategory) {
    return await this.db.update(schema.categories).set(data).where(eq(schema.categories.idCategory, id)).returning();
  }

  async changeStatus(id: number, status: UpdateCategoryStatus) {
    return await this.db.update(schema.categories).set(status).where(eq(schema.categories.idCategory, id)).returning();
  }
}
