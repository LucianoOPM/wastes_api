import { Injectable, NotFoundException } from '@nestjs/common';
import { MovementsRepository } from '@movements/movements.repository';
import { CategoriesService } from '@categories/categories.service';
import { FilterMovementDto, NewMovementDto, UpdateMovementDto } from '@movements/movements.schema';
import { UsersService } from '@src/users/users.service';
import { UpdateMovementStatus } from '@src/database/types';

@Injectable()
export class MovementsService {
  constructor(
    protected readonly movementRepository: MovementsRepository,
    protected readonly categoryService: CategoriesService,
    protected readonly userService: UsersService,
  ) {}

  async create(user: number, movementData: NewMovementDto) {
    const category = await this.categoryService.findOne(movementData.category);
    const userData = await this.userService.findById(user);
    const today = new Date();

    return await this.movementRepository.create({
      title: movementData.title,
      type: movementData.type,
      date: movementData.date,
      amount: movementData.amount.toString(),
      categoryId: category.idCategory,
      description: movementData.description,
      userId: userData.idUser,
      createdAt: today,
    });
  }

  async findAll(idUser: number, filter: FilterMovementDto) {
    const user = await this.userService.findById(idUser);
    const startDate = filter.startDate ? `${filter.startDate} 00:00:00` : undefined;
    const endDate = filter.endDate ? `${filter.endDate} 23:59:59` : undefined;
    const createdAtAfter = filter.createdAfter ? new Date(filter.createdAfter) : undefined;
    const createdAtBefore = filter.createdBefore ? new Date(filter.createdBefore) : undefined;

    const parsedFilter = {
      limit: filter.limit,
      page: filter.page,
      orderBy: filter.orderBy,
      order: filter.order,
      endDate,
      startDate,
      createdBefore: createdAtBefore,
      createdAfter: createdAtAfter,
      title: filter.title,
      type: filter.type,
      maxAmount: filter.maxAmount?.toString(),
      minAmount: filter.minAmount?.toString(),
      category: filter.category,
    };

    const { results, total } = await this.movementRepository.getUserMovements(user.idUser, parsedFilter);
    const parsedResults = results.map((movement) => {
      const { category, ...rest } = movement;
      return {
        ...rest,
        categoryName: category.name,
      };
    });
    const totalPages = Math.ceil(total / filter.limit);
    return {
      data: parsedResults,
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

  async findOne(userId: number, id: number) {
    const user = await this.userService.findById(userId);
    const movement = await this.movementRepository.getMovement(user.idUser, id);
    if (!movement) throw new NotFoundException('Movement was not found');
    const { category, ...rest } = movement;
    return { ...rest, categoryName: category.name };
  }

  async update(idUser: number, idMovement: number, updateMovementDto: UpdateMovementDto) {
    const movement = await this.findOne(idUser, idMovement);
    return await this.movementRepository.updateMovement(movement.id, {
      ...updateMovementDto,
      amount: updateMovementDto.amount ? updateMovementDto.amount.toString() : undefined,
    });
  }

  async changeStatus(userId: number, id: number, status: UpdateMovementStatus) {
    const movement = await this.findOne(userId, id);
    return await this.movementRepository.updateMovementStatus(movement.id, status);
  }
}
