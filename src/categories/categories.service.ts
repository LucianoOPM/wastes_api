import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '@categories/categories.repository';
import { FilterCategoryDto, NewCategoryDto, UpdateCategoryDto, UpdateCategoryStatusDto } from '@categories/categories.schema';

@Injectable()
export class CategoriesService {
  constructor(protected readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: NewCategoryDto) {
    const category = await this.categoriesRepository.getByName(createCategoryDto.name);
    if (category) throw new BadRequestException('Category already exists');
    return await this.categoriesRepository.create(createCategoryDto);
  }

  async findAll(filter: FilterCategoryDto) {
    const { total, results } = await this.categoriesRepository.getAll(filter);
    const totalPages = Math.ceil(total / filter.limit);

    return {
      data: results,
      totalRecords: total,
      totalPages,
      currentPage: filter.page,
      pageSize: filter.limit,
      hasNextPage: filter.page < totalPages,
      hasPreviousPage: filter.page > 1,
      nextPage: filter.page < totalPages ? filter.page + 1 : undefined,
      previoudPage: filter.page > 1 ? filter.page - 1 : undefined,
    };
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.getById(id);
    if (!category) throw new NotFoundException('Category was not found');
    if (!category.isActive) throw new BadRequestException('Category is not active');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return await this.categoriesRepository.update(id, updateCategoryDto);
  }

  async remove(id: number, status: UpdateCategoryStatusDto) {
    return await this.categoriesRepository.changeStatus(id, status);
  }
}
