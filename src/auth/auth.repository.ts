import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@database/schema';
import { NewSession } from '@database/types';
import { and, eq, ne } from 'drizzle-orm';
import type { UUID } from 'node:crypto';

@Injectable()
export class AuthRepository {
  constructor(@Inject('DRIZZLE') protected readonly db: NodePgDatabase<typeof schema>) {}

  async create(sessionData: NewSession) {
    return await this.db.insert(schema.sessions).values(sessionData).returning();
  }

  async getSession(idUser: number, idToken: UUID) {
    return await this.db.query.sessions.findFirst({
      where: (session, { eq, and }) => and(eq(session.userId, idUser), eq(session.idSession, idToken)),
    });
  }

  async inactivate(idSession: UUID) {
    return await this.db
      .update(schema.sessions)
      .set({ isValid: false })
      .where(eq(schema.sessions.idSession, idSession))
      .returning();
  }

  async revokeOthers(idUser: number, idToken: UUID) {
    return await this.db
      .update(schema.sessions)
      .set({ isValid: false })
      .where(and(eq(schema.sessions.userId, idUser), ne(schema.sessions.idSession, idToken)));
  }

  async revokeAll(idUser: number) {
    return await this.db.update(schema.sessions).set({ isValid: false }).where(eq(schema.sessions.userId, idUser));
  }
}
