import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryService } from './country.service';
import { Country } from './country.model';
import { NotFoundException } from '@nestjs/common';

describe('CountryService', () => {
  let service: CountryService;
  let countryModel: Model<Country>;
  const mockFind = {
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getModelToken('Country'),
          useValue: {
            find: jest.fn().mockReturnValue(mockFind),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
    countryModel = module.get<Model<Country>>(getModelToken('Country'));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getTopVotedCountries', () => {
    it('should return top 10 voted countries', async () => {
      const mockCountries = [
        { name: 'Country 1', votes: 10 },
        { name: 'Country 2', votes: 8 },
        { name: 'Country 3', votes: 6 },
        { name: 'Country 4', votes: 5 },
        { name: 'Country 5', votes: 4 },
        { name: 'Country 6', votes: 3 },
        { name: 'Country 7', votes: 3 },
        { name: 'Country 8', votes: 2 },
        { name: 'Country 9', votes: 2 },
        { name: 'Country 10', votes: 1 },
      ];
      jest.spyOn(mockFind, 'lean').mockReturnValueOnce(mockCountries);

      const result = await service.getTopVotedCountries();

      expect(result).toHaveLength(10);
      expect(result[0].name).toBe('Country 1');
      expect(result[1].name).toBe('Country 2');
      expect(countryModel.find).toHaveBeenCalled();
    });
  });

  describe('voteCountry', () => {
    it('should increment the vote count for the given country', async () => {
      const countryName = 'Country 1';
      const updatedCountry = { name: countryName, votes: 5 };
      jest
        .spyOn(countryModel, 'findOneAndUpdate')
        .mockResolvedValueOnce(updatedCountry as any);

      const result = await service.voteCountry(countryName);

      expect(result).toEqual(updatedCountry);
      expect(countryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { name: countryName },
        { $inc: { votes: 1 } },
        { new: true },
      );
    });

    it('should throw NotFoundException if country is not found', async () => {
      const countryName = 'Country X';
      jest.spyOn(countryModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

      await expect(service.voteCountry(countryName)).rejects.toThrow(
        NotFoundException,
      );
      expect(countryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { name: countryName },
        { $inc: { votes: 1 } },
        { new: true },
      );
    });
  });
});
