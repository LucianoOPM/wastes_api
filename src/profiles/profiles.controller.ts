import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  BadRequestException,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Patch,
} from '@nestjs/common';
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
    const profile = await this.profilesService.findByName(profileData.name);
    if (profile) throw new BadRequestException('Profile name already exists');
    return this.profilesService.createProfile(profileData);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(FilterProfileSchema))
  async findAll(@Query() filter: FilterProfileDto) {
    return await this.profilesService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const profile = await this.profilesService.findProfileById(id);
    if (!profile) throw new NotFoundException('Profile is not found');
    if (!profile.isActive) throw new BadRequestException('Profile is not active');
    return profile;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profilesService.findProfileById(id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    if (!profile.isActive) {
      throw new BadRequestException('Profile is not active');
    }
    return await this.profilesService.update(id, updateProfileDto);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) idProfile: number,
    @Body(new ZodValidationPipe(UpdateStatusSchema)) status: UpdateStatusDto,
  ) {
    const profile = await this.profilesService.findProfileById(idProfile);
    if (!profile) throw new NotFoundException('Profile is not found');
    return await this.profilesService.updateStatus(idProfile, status);
  }
}
