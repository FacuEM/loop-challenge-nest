import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { CountryService } from '../country/country.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly countryService: CountryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, country } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      const newUser = new this.userModel({
        name,
        email,
        country,
      });

      await newUser.save();

      await this.countryService.voteCountry(country);

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
