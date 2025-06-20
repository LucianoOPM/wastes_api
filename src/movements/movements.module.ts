import { Module } from '@nestjs/common';
import { MovementsService } from '@movements/movements.service';
import { MovementsController } from '@movements/movements.controller';
import { DatabaseModule } from '@database/database.module';
import { MovementsRepository } from '@movements/movements.repository';
import { CategoriesModule } from '@categories/categories.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [DatabaseModule, CategoriesModule, UsersModule],
  controllers: [MovementsController],
  providers: [MovementsService, MovementsRepository],
})
export class MovementsModule {}
