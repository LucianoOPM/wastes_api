import { Controller, Get, Post, Body, Param, UsePipes, Query, ParseIntPipe, Put, Patch } from '@nestjs/common';
import { ZodValidationPipe } from '@src/zodvalidation/zodvalidation.pipe';
import { UsersService } from '@users/users.service';
import {
  CreateUserSchema,
  CreateUserDto,
  FilterUserSchema,
  FilterUserDto,
  UpdateUserSchema,
  UpdateUserDto,
  UpdateStatusSchema,
  UpdateStatusDto,
} from '@users/user.schema';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(protected readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async create(@Body() userData: CreateUserDto) {
    const res = await this.usersService.createUser(userData);
    return {
      success: true,
      data: res,
    };
  }

  @Get()
  @UsePipes(new ZodValidationPipe(FilterUserSchema))
  async findAll(@Query() filter: FilterUserDto) {
    const res = await this.usersService.findAll(filter);
    return {
      success: true,
      data: res,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    return {
      success: true,
      data: user,
    };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(UpdateUserSchema)) userData: UpdateUserDto) {
    const { idUser, email, isActive, profileId, firstName, lastName } = await this.usersService.update(id, userData);
    return {
      success: true,
      data: {
        idUser,
        email,
        isActive,
        profileId,
        firstName,
        lastName,
      },
    };
  }

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateStatusSchema)) userStatus: UpdateStatusDto,
  ) {
    const { idUser, email, isActive, profileId, firstName, lastName } = await this.usersService.updateStatus(id, userStatus);
    return {
      success: true,
      data: {
        idUser: idUser,
        email,
        isActive,
        profileId,
        firstName,
        lastName,
      },
    };
  }
}
