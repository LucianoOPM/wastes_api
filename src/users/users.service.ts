import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto, FilterUserDto, UpdateStatusDto, UpdateUserDto } from '@users/user.schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schema';
import { eq, SQL } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DRIZZLE') protected readonly db: NodePgDatabase<typeof schema>) {}

  async findUserByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async create(user: CreateUserDto) {
    const [newUser] = await this.db.insert(schema.users).values(user).returning();
    return newUser;
  }

  async findAll(filter: FilterUserDto) {
    return await this.db.query.users.findMany({
      columns: {
        password: false,
      },
      where: (users, { and, eq }) => {
        const filters: SQL[] = [];
        if (filter.email) {
          filters.push(eq(users.email, filter.email));
        }
        if (filter.firstName) {
          filters.push(eq(users.firstName, filter.firstName));
        }
        if (filter.lastName) {
          filters.push(eq(users.lastName, filter.lastName));
        }
        if (filter.profileId) {
          filters.push(eq(users.profileId, filter.profileId));
        }
        if (filter.isActive !== undefined) {
          filters.push(eq(users.isActive, filter.isActive));
        }
        return and(...filters);
      },
      orderBy: (users, { asc, desc }) => {
        if (filter.order == 'asc') {
          return asc(users[filter.orderBy]);
        }
        if (filter.order == 'desc') {
          return desc(users[filter.orderBy]);
        }
        return asc(users.idUser);
      },
      limit: filter.limit,
      offset: filter.page && filter.limit ? (filter.page - 1) * filter.limit : undefined,
    });
  }

  async findById(idUser: number) {
    return await this.db.query.users.findFirst({
      columns: {
        password: false,
      },
      where: (users, { eq }) => eq(users.idUser, idUser),
    });
  }

  async update(idUser: number, updateData: UpdateUserDto) {
    const [userData] = await this.db.update(schema.users).set(updateData).where(eq(schema.users.idUser, idUser)).returning();
    return userData;
  }

  async updateStatus(idUser: number, userStatus: UpdateStatusDto) {
    const [user] = await this.db.update(schema.users).set(userStatus).where(eq(schema.users.idUser, idUser)).returning();
    return user;
  }
}
