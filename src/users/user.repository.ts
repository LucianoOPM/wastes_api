import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schemas';
import { NewUser, UpdateUser, UpdateUserStatus } from '@database/types';
import { FilterUserDto } from '@users/user.schema';
import { SQL, and, eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(@Inject('DRIZZLE') protected readonly db: NodePgDatabase<typeof schema>) {}
  async findUserByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async create(user: NewUser) {
    const [newUser] = await this.db.insert(schema.users).values(user).returning();
    return newUser;
  }

  async findAll(filter: FilterUserDto) {
    const { isActive, firstName, lastName, email, page, profileId, order, orderBy, limit } = filter;
    const conditions: SQL[] = [];
    if (isActive !== undefined) {
      conditions.push(eq(schema.users.isActive, isActive));
    }
    if (email) {
      conditions.push(eq(schema.users.email, email));
    }
    if (firstName) {
      conditions.push(eq(schema.users.firstName, firstName));
    }
    if (lastName) {
      conditions.push(eq(schema.users.lastName, lastName));
    }
    if (profileId) {
      conditions.push(eq(schema.users.profileId, profileId));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [results, total] = await Promise.all([
      this.db.query.users.findMany({
        columns: { password: false },
        where: whereClause,
        orderBy: (users, { asc, desc }) => (order === 'asc' ? asc(users[orderBy]) : desc(users[orderBy])),
        limit,
        offset: (page - 1) * limit,
      }),
      this.db.$count(schema.users, whereClause),
    ]);
    return {
      results,
      total,
    };
  }

  async findById(idUser: number) {
    return await this.db.query.users.findFirst({
      columns: {
        password: false,
      },
      where: (users, { eq }) => eq(users.idUser, idUser),
    });
  }

  async update(idUser: number, updateData: UpdateUser) {
    const [userData] = await this.db.update(schema.users).set(updateData).where(eq(schema.users.idUser, idUser)).returning();
    return userData;
  }

  async updateStatus(idUser: number, userStatus: UpdateUserStatus) {
    const [user] = await this.db.update(schema.users).set(userStatus).where(eq(schema.users.idUser, idUser)).returning();
    return user;
  }
}
