import { Controller, Get, Post, Body, UseGuards, Query, ParseIntPipe, Param, Put, Patch } from '@nestjs/common';
import { TransactionsService } from '@src/transactions/transactions.service';
import { ZodValidationPipe } from '@src/zodvalidation/zodvalidation.pipe';
import {
  NewTransactionDto,
  NewTransactionSchema,
  FilterTransactionSchema,
  FilterTransactionDto,
  UpdateTransactionSchema,
  UpdateTransactionDto,
  UpdateTransactionStatusDto,
  UpdateTransactionStatusSchema,
} from '@src/transactions/transactions.schema';
import { JwtAccessToken } from '@guards/jwt-access.guard';
import { User } from '@decorators/user.decorators';

@Controller('transactions')
@UseGuards(JwtAccessToken)
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(NewTransactionSchema)) transactionData: NewTransactionDto,
    @User() user: { idUser: number },
  ) {
    const res = await this.transactionService.create(user.idUser, transactionData);
    return {
      success: true,
      data: res,
    };
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(FilterTransactionSchema)) filter: FilterTransactionDto,
    @User() user: { idUser: number },
  ) {
    const res = await this.transactionService.findAll(user.idUser, filter);
    return {
      success: true,
      data: res,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: { idUser: number }) {
    const res = await this.transactionService.findOne(user.idUser, id);
    return {
      success: true,
      data: res,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) idTransaction: number,
    @Body(new ZodValidationPipe(UpdateTransactionSchema)) transactionData: UpdateTransactionDto,
    @User() user: { idUser: number },
  ) {
    const res = await this.transactionService.update(user.idUser, idTransaction, transactionData);
    return {
      success: true,
      data: res,
    };
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @User() user: { idUser: number },
    @Body(new ZodValidationPipe(UpdateTransactionStatusSchema)) status: UpdateTransactionStatusDto,
  ) {
    const res = await this.transactionService.changeStatus(user.idUser, id, status);
    return {
      success: true,
      data: res,
    };
  }
}
