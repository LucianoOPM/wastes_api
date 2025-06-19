import { Module } from '@nestjs/common';
import { databaseProvider } from '@database/database.provider';

@Module({
  imports: [],
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class DatabaseModule {}
