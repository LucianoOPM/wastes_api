import { Module } from '@nestjs/common';
import { CategoriesService } from '@categories/categories.service';
import { CategoriesController } from '@categories/categories.controller';
import { DatabaseModule } from '@database/database.module';
import { CategoriesRepository } from '@categories/categories.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
