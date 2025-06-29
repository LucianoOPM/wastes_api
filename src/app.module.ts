import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@database/database.module';
import { ProfilesModule } from '@profiles/profiles.module';
import { AuthModule } from '@auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import configuration from '@config/configuration.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    DatabaseModule,
    ProfilesModule,
    AuthModule,
    TransactionsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
