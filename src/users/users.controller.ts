import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  BadRequestException,
  NotFoundException,
  Query,
  ParseIntPipe,
  Put,
  Patch,
} from '@nestjs/common';
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
import { Hash } from '@lib/hash';
import { ProfilesService } from '@profiles/profiles.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly profileService: ProfilesService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async create(@Body() userData: CreateUserDto) {
    const userDb = await this.usersService.findUserByEmail(userData.email);

    if (userDb) {
      throw new BadRequestException('User with this email already exists');
    }
    const profile = await this.profileService.findProfileById(userData.profileId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    if (!profile.isActive) {
      throw new BadRequestException('Profile is not active');
    }
    const insertUser: CreateUserDto = {
      ...userData,
      password: await Hash.hashPassword(userData.password),
    };

    const { idUser, email, isActive, profileId, firstName, lastName } = await this.usersService.create(insertUser);
    return {
      idUser,
      email,
      profileId,
      isActive,
      firstName,
      lastName,
    };
  }

  @Get()
  @UsePipes(new ZodValidationPipe(FilterUserSchema))
  findAll(@Query() filter: FilterUserDto) {
    return this.usersService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new BadRequestException('User is not active');
    return user;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(UpdateUserSchema)) userData: UpdateUserDto) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new BadRequestException('User is not active');
    if (userData.profileId) {
      const profile = await this.profileService.findProfileById(userData.profileId);
      if (!profile) throw new NotFoundException('Profile was not found');
      if (!profile.isActive) throw new BadRequestException('Selected profile is not active');
    }
    const { idUser, email, isActive, profileId, firstName, lastName } = await this.usersService.update(id, userData);
    return {
      idUser,
      email,
      isActive,
      profileId,
      firstName,
      lastName,
    };
  }

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateStatusSchema)) userStatus: UpdateStatusDto,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const { idUser, email, isActive, profileId, firstName, lastName } = await this.usersService.updateStatus(id, userStatus);
    return {
      idUser: idUser,
      email,
      isActive,
      profileId,
      firstName,
      lastName,
    };
  }
}
