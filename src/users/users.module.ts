import { Module } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';
import { DatabaseModule } from '@database/database.module';
import { ProfilesModule } from '@profiles/profiles.module';

@Module({
  imports: [DatabaseModule, ProfilesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
