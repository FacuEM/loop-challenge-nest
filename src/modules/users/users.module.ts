import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CountryModule } from '../country/country.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    CountryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
