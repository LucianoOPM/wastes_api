import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schema';
import { NewMovement, UpdateMovement, QueryMovement, UpdateMovementStatus } from '@database/types';
import { and, eq, gte, lte, SQL } from 'drizzle-orm';

@Injectable()
export class MovementsRepository {
  constructor(@Inject('DRIZZLE') protected readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: NewMovement) {
    return await this.db.insert(schema.movements).values(data).returning();
  }

  async getUserMovements(idUser: number, filter: QueryMovement) {
    const {
      limit,
      page,
      endDate,
      startDate,
      title,
      type,
      order,
      orderBy,
      maxAmount,
      minAmount,
      createdAfter,
      createdBefore,
      category,
      isActive,
    } = filter;
    const conditions: SQL[] = [eq(schema.movements.userId, idUser)];

    if (endDate) conditions.push(lte(schema.movements.date, endDate));
    if (startDate) conditions.push(gte(schema.movements.date, startDate));
    if (createdBefore) conditions.push(lte(schema.movements.createdAt, createdBefore));
    if (createdAfter) conditions.push(gte(schema.movements.createdAt, createdAfter));
    if (title) conditions.push(eq(schema.movements.title, title));
    if (type) conditions.push(eq(schema.movements.type, type));
    if (maxAmount) conditions.push(lte(schema.movements.amount, maxAmount));
    if (minAmount) conditions.push(gte(schema.movements.amount, minAmount));
    if (category) conditions.push(eq(schema.movements.categoryId, category));
    if (isActive) conditions.push(eq(schema.movements.isActive, isActive));

    const [results, total] = await Promise.all([
      this.db.query.movements.findMany({
        columns: { categoryId: false, userId: false },
        where: and(...conditions),
        with: { category: { columns: { name: true } } },
        orderBy: (movements, { asc, desc }) => (order === 'asc' ? asc(movements[orderBy]) : desc(movements[orderBy])),
        limit,
        offset: (page - 1) * limit,
      }),
      this.db.$count(schema.movements, and(...conditions)),
    ]);
    return {
      results,
      total,
    };
  }

  async getMovement(idUser: number, idMovement: number) {
    return await this.db.query.movements.findFirst({
      with: { category: { columns: { name: true } } },
      columns: { userId: false, categoryId: false },
      where: (movement, { eq, and }) => and(eq(movement.userId, idUser), eq(movement.id, idMovement)),
    });
  }

  async updateMovement(idMovement: number, data: UpdateMovement) {
    return await this.db.update(schema.movements).set(data).where(eq(schema.movements.id, idMovement)).returning();
  }

  async updateMovementStatus(idMovement: number, status: UpdateMovementStatus) {
    return await this.db.update(schema.movements).set(status).where(eq(schema.movements.id, idMovement)).returning();
  }
}
