import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schemas';
import { NewTransaction, UpdateTransaction, QueryTransactions, UpdateTransactionStatus } from '@database/types';
import { and, eq, gte, lte, SQL } from 'drizzle-orm';

@Injectable()
export class TransactionsRepository {
  constructor(@Inject('DRIZZLE') protected readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: NewTransaction) {
    return await this.db.insert(schema.transactions).values(data).returning();
  }

  async getUserTransactions(idUser: number, filter: QueryTransactions) {
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
    const conditions: SQL[] = [eq(schema.transactions.userId, idUser)];

    if (endDate) conditions.push(lte(schema.transactions.date, endDate));
    if (startDate) conditions.push(gte(schema.transactions.date, startDate));
    if (createdBefore) conditions.push(lte(schema.transactions.createdAt, createdBefore));
    if (createdAfter) conditions.push(gte(schema.transactions.createdAt, createdAfter));
    if (title) conditions.push(eq(schema.transactions.title, title));
    if (type) conditions.push(eq(schema.transactions.type, type));
    if (maxAmount) conditions.push(lte(schema.transactions.amount, maxAmount));
    if (minAmount) conditions.push(gte(schema.transactions.amount, minAmount));
    if (category) conditions.push(eq(schema.transactions.categoryId, category));
    if (isActive) conditions.push(eq(schema.transactions.isActive, isActive));

    const [results, total] = await Promise.all([
      this.db.query.transactions.findMany({
        columns: { categoryId: false, userId: false },
        where: and(...conditions),
        with: { category: { columns: { name: true } } },
        orderBy: (transactions, { asc, desc }) => (order === 'asc' ? asc(transactions[orderBy]) : desc(transactions[orderBy])),
        limit,
        offset: (page - 1) * limit,
      }),
      this.db.$count(schema.transactions, and(...conditions)),
    ]);
    return {
      results,
      total,
    };
  }

  async getTransactions(idUser: number, idTransaction: number) {
    return await this.db.query.transactions.findFirst({
      with: { category: { columns: { name: true } } },
      columns: { userId: false, categoryId: false },
      where: (transaction, { eq, and }) => and(eq(transaction.userId, idUser), eq(transaction.id, idTransaction)),
    });
  }

  async updateTransaction(idTransaction: number, data: UpdateTransaction) {
    return await this.db.update(schema.transactions).set(data).where(eq(schema.transactions.id, idTransaction)).returning();
  }

  async updateTransactionStatus(idTransaction: number, status: UpdateTransactionStatus) {
    return await this.db.update(schema.transactions).set(status).where(eq(schema.transactions.id, idTransaction)).returning();
  }
}
