import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { RefreshTokenStrategy } from '@auth/strategy/refresh.token';
import { AccessTokenStrategy } from '@auth/strategy/access.token';
import ConfiguredJwtModule from '@auth/config/jwt.register';
import { UsersModule } from '@users/users.module';
import { AuthRepository } from '@auth/auth.repository';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [ConfiguredJwtModule, UsersModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, RefreshTokenStrategy, AccessTokenStrategy],
})
export class AuthModule {}
