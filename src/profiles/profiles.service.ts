import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto, FilterProfileDto, UpdateProfileDto, UpdateStatusDto } from '@profiles/profile.schema';
import { ProfileRepository } from '@profiles/profile.repository';

@Injectable()
export class ProfilesService {
  constructor(protected readonly repository: ProfileRepository) {}

  async createProfile(profileData: CreateProfileDto) {
    const profile = await this.repository.findByName(profileData.name);
    if (profile) throw new BadRequestException('Profile name already exists');
    return await this.repository.createProfile(profileData);
  }

  async findAll(filter: FilterProfileDto) {
    const { total, results } = await this.repository.findAll(filter);
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

  async findProfileById(id: number) {
    const profile = await this.repository.findProfileById(id);
    if (!profile) throw new NotFoundException('Profile not found');
    if (!profile.isActive) throw new BadRequestException('Profile is not active');
    return profile;
  }

  async update(idProfile: number, newData: UpdateProfileDto) {
    const profile = await this.repository.findProfileById(idProfile);
    if (!profile) throw new NotFoundException('Profile not found');
    if (!profile.isActive) throw new BadRequestException('Profile is not active');

    if (newData.name) {
      const profileName = await this.repository.findByName(newData.name);
      if (profileName && profileName.idProfile !== profile.idProfile) {
        throw new BadRequestException('Already exists another profile with this name');
      }
    }

    return await this.repository.update(idProfile, newData);
  }

  async updateStatus(idProfile: number, status: UpdateStatusDto) {
    const profile = await this.repository.findProfileById(idProfile);
    if (!profile) throw new NotFoundException('Profile is not found');
    return await this.repository.updateStatus(idProfile, status);
  }
}
