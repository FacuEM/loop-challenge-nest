import { Controller, Get } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getAll() {
    try {
      const countries = await this.countryService.getTopVotedCountries();
      return countries;
    } catch (error) {
      return { message: error.message };
    }
  }
}
