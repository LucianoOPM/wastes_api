import { Injectable } from '@nestjs/common';
import { CreateUserDto, FilterUserDto, UpdateUserDto, UpdateStatusDto } from '@users/user.schema';
import { UserRepository } from '@users/user.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Hash } from '@src/lib/hash';
import { ProfilesService } from '@profiles/profiles.service';

@Injectable()
export class UsersService {
  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly profileService: ProfilesService,
  ) {}

  async createUser(userData: CreateUserDto) {
    const userDb = await this.userRepository.findUserByEmail(userData.email);

    if (userDb) {
      throw new BadRequestException('User with this email already exists');
    }
    await this.profileService.findProfileById(userData.profileId);
    const insertUser: CreateUserDto = {
      ...userData,
      password: await Hash.hashPassword(userData.password),
    };

    const { idUser, email, isActive, profileId, firstName, lastName } = await this.userRepository.create(insertUser);
    return {
      idUser,
      email,
      isActive,
      profileId,
      firstName,
      lastName,
    };
  }

  async findAll(filter: FilterUserDto) {
    const { results, total } = await this.userRepository.findAll(filter);
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

  async findById(idUser: number) {
    const user = await this.userRepository.findById(idUser);
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new BadRequestException('User is not active');
    return user;
  }

  async update(idUser: number, userData: UpdateUserDto) {
    const user = await this.userRepository.findById(idUser);
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new BadRequestException('User is not active');

    if (userData.profileId) {
      const profile = await this.profileService.findProfileById(userData.profileId);
      if (!profile) throw new NotFoundException('Profile was not found');
      if (!profile.isActive) throw new BadRequestException('Selected profile is not active');
    }

    return await this.userRepository.update(idUser, userData);
  }

  async updateStatus(idUser: number, userStatus: UpdateStatusDto) {
    const user = await this.userRepository.findById(idUser);
    if (!user) throw new NotFoundException('User not found');
    return await this.userRepository.updateStatus(idUser, userStatus);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new BadRequestException('User is inactive');
    return user;
  }
}
