import { Controller, Get, Post, Body, UseGuards, Query, ParseIntPipe, Param, Put, Patch } from '@nestjs/common';
import { MovementsService } from '@movements/movements.service';
import { ZodValidationPipe } from '@src/zodvalidation/zodvalidation.pipe';
import {
  NewMovementDto,
  NewMovementSchema,
  FilterMovementSchema,
  FilterMovementDto,
  UpdateMovementSchema,
  UpdateMovementDto,
  UpdateMovementStatusDto,
  UpdateMovementStatusSchema,
} from '@movements/movements.schema';
import { JwtAccessToken } from '@guards/jwt-access.guard';
import { User } from '@decorators/user.decorators';

@Controller('movements')
@UseGuards(JwtAccessToken)
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  async create(@Body(new ZodValidationPipe(NewMovementSchema)) movementData: NewMovementDto, @User() user: { idUser: number }) {
    const res = await this.movementsService.create(user.idUser, movementData);
    return {
      success: true,
      data: res,
    };
  }

  @Get()
  async findAll(@Query(new ZodValidationPipe(FilterMovementSchema)) filter: FilterMovementDto, @User() user: { idUser: number }) {
    const res = await this.movementsService.findAll(user.idUser, filter);
    return {
      success: true,
      data: res,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: { idUser: number }) {
    const res = await this.movementsService.findOne(user.idUser, id);
    return {
      success: true,
      data: res,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) idMovement: number,
    @Body(new ZodValidationPipe(UpdateMovementSchema)) movementData: UpdateMovementDto,
    @User() user: { idUser: number },
  ) {
    const res = await this.movementsService.update(user.idUser, idMovement, movementData);
    return {
      success: true,
      data: res,
    };
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @User() user: { idUser: number },
    @Body(new ZodValidationPipe(UpdateMovementStatusSchema)) status: UpdateMovementStatusDto,
  ) {
    const res = await this.movementsService.changeStatus(user.idUser, id, status);
    return {
      success: true,
      data: res,
    };
  }
}
