import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export class Hash {
  private static readonly saltRounds = 10;

  public static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error on creating user');
    }
  }

  public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
