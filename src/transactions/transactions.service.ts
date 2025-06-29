import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from '@src/transactions/transactions.repository';
import { CategoriesService } from '@categories/categories.service';
import { FilterTransactionDto, NewTransactionDto, UpdateTransactionDto } from '@src/transactions/transactions.schema';
import { UsersService } from '@src/users/users.service';
import { UpdateTransactionStatus } from '@src/database/types';

@Injectable()
export class TransactionsService {
  constructor(
    protected readonly transactionRepository: TransactionsRepository,
    protected readonly categoryService: CategoriesService,
    protected readonly userService: UsersService,
  ) {}

  async create(user: number, transactionData: NewTransactionDto) {
    const category = await this.categoryService.findOne(transactionData.category);
    const userData = await this.userService.findById(user);
    const today = new Date();

    return await this.transactionRepository.create({
      title: transactionData.title,
      type: transactionData.type,
      date: transactionData.date,
      amount: transactionData.amount.toString(),
      categoryId: category.idCategory,
      description: transactionData.description,
      userId: userData.idUser,
      createdAt: today,
    });
  }

  async findAll(idUser: number, filter: FilterTransactionDto) {
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

    const { results, total } = await this.transactionRepository.getUserTransactions(user.idUser, parsedFilter);
    const parsedResults = results.map((transactions) => {
      const { category, ...rest } = transactions;
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
    const transaction = await this.transactionRepository.getTransactions(user.idUser, id);
    if (!transaction) throw new NotFoundException('Transaction was not found');
    const { category, ...rest } = transaction;
    return { ...rest, categoryName: category.name };
  }

  async update(idUser: number, idTransaction: number, transactionUpdateData: UpdateTransactionDto) {
    const transaction = await this.findOne(idUser, idTransaction);
    return await this.transactionRepository.updateTransaction(transaction.id, {
      ...transactionUpdateData,
      amount: transactionUpdateData.amount ? transactionUpdateData.amount.toString() : undefined,
    });
  }

  async changeStatus(userId: number, id: number, status: UpdateTransactionStatus) {
    const transaction = await this.findOne(userId, id);
    return await this.transactionRepository.updateTransactionStatus(transaction.id, status);
  }
}
