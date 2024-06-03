import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { CountryService } from '../country/country.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly countryService: CountryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, country } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = new this.userModel({
      name,
      email,
      country,
    });

    await newUser.save();

    await this.countryService.voteCountry(country);

    return newUser;
  }

  async getAll(): Promise<User[]> {
    return this.userModel.find();
  }
}
