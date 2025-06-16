import { Controller, Get, Post, Body, UsePipes, Query, Param, ParseIntPipe, Put, Patch } from '@nestjs/common';
import { ProfilesService } from '@profiles/profiles.service';
import { ZodValidationPipe } from '@src/zodvalidation/zodvalidation.pipe';
import {
  CreateProfileSchema,
  CreateProfileDto,
  FilterProfileSchema,
  FilterProfileDto,
  UpdateProfileSchema,
  UpdateProfileDto,
  UpdateStatusSchema,
  UpdateStatusDto,
} from '@profiles/profile.schema';

@Controller({ path: 'profiles', version: '1' })
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProfileSchema))
  async create(@Body() profileData: CreateProfileDto) {
    const profile = await this.profilesService.createProfile(profileData);
    return {
      success: true,
      data: profile,
    };
  }

  @Get()
  @UsePipes(new ZodValidationPipe(FilterProfileSchema))
  async findAll(@Query() filter: FilterProfileDto) {
    const data = await this.profilesService.findAll(filter);
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const profile = await this.profilesService.findProfileById(id);
    return {
      success: true,
      data: profile,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) updateProfileDto: UpdateProfileDto,
  ) {
    const res = await this.profilesService.update(id, updateProfileDto);
    return {
      success: true,
      data: res,
    };
  }

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) idProfile: number,
    @Body(new ZodValidationPipe(UpdateStatusSchema)) status: UpdateStatusDto,
  ) {
    const res = await this.profilesService.updateStatus(idProfile, status);
    return {
      success: true,
      data: res,
    };
  }
}
