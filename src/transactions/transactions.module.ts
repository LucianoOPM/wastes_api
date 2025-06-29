import { Module } from '@nestjs/common';
import { TransactionsService } from '@src/transactions/transactions.service';
import { TransactionsController } from '@src/transactions/transactions.controller';
import { DatabaseModule } from '@database/database.module';
import { TransactionsRepository } from '@src/transactions/transactions.repository';
import { CategoriesModule } from '@categories/categories.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [DatabaseModule, CategoriesModule, UsersModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
