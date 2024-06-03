import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.countryModel.find().sort({ votes: -1 }).limit(10).lean();
  }

  async voteCountry(name: string): Promise<Country> {
    const updatedCountry = await this.countryModel.findOneAndUpdate(
      { name },
      { $inc: { votes: 1 } },
      { new: true },
    );

    if (!updatedCountry) {
      throw new NotFoundException(`Country ${name} not found`);
    }

    return updatedCountry;
  }
}
