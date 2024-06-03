import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { CountryModule } from './modules/country/country.module';

@Module({
  imports: [
    UsersModule,
    CountryModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/country-votes'),
  ],
})
export class AppModule {}
