import { Module } from '@nestjs/common';
import { ProfilesService } from '@profiles/profiles.service';
import { ProfilesController } from '@profiles/profiles.controller';
import { DatabaseModule } from '@database/database.module';
import { ProfileRepository } from '@profiles/profile.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfileRepository],
  exports: [ProfilesService],
})
export class ProfilesModule {}
