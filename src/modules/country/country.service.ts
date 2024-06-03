import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './country.model';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel('Country')
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async getTopVotedCountries(): Promise<Country[]> {
    try {
      return this.countryModel.find().sort({ votes: -1 }).limit(10);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve top voted countries',
      );
    }
  }

  async voteCountry(name: string): Promise<Country> {
    try {
      const updatedCountry = await this.countryModel.findOneAndUpdate(
        { name },
        { $inc: { votes: 1 } },
        { new: true },
      );

      if (!updatedCountry) {
        throw new NotFoundException(`Country ${name} not found`);
      }

      return updatedCountry;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to vote for country');
      }
    }
  }
}
