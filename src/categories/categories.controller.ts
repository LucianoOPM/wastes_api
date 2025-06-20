import { Controller, Get, Post, Body, Patch, Param, UseGuards, UsePipes, Query, ParseIntPipe, Put } from '@nestjs/common';
import { CategoriesService } from '@categories/categories.service';
import {
  CreateCategorySchema,
  FilterCategorySchema,
  UpdateCategorySchema,
  UpdateCategoryStatusSchema,
  NewCategoryDto,
  FilterCategoryDto,
  UpdateCategoryDto,
  UpdateCategoryStatusDto,
} from '@categories/categories.schema';
import { JwtRefreshAuthGuard } from '@guards/jwt-refresh.guard';
import { ZodValidationPipe } from '@src/zodvalidation/zodvalidation.pipe';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategorySchema))
  async create(@Body() createCategoryDto: NewCategoryDto) {
    const res = await this.categoriesService.create(createCategoryDto);
    return {
      success: true,
      data: res,
    };
  }

  @Get()
  @UsePipes(new ZodValidationPipe(FilterCategorySchema))
  async findAll(@Query() filter: FilterCategoryDto) {
    const res = await this.categoriesService.findAll(filter);
    return {
      success: true,
      data: res,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const res = await this.categoriesService.findOne(id);
    return {
      success: true,
      data: res,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateCategorySchema)) updateCategoryDto: UpdateCategoryDto,
  ) {
    const res = await this.categoriesService.update(id, updateCategoryDto);
    return {
      success: true,
      data: res,
    };
  }

  @Patch(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateCategoryStatusSchema)) categoryStatus: UpdateCategoryStatusDto,
  ) {
    const res = await this.categoriesService.remove(id, categoryStatus);
    return {
      success: true,
      data: res,
    };
  }
}
