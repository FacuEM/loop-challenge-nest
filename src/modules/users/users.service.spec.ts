import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CountryService } from '../country/country.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockCountryService = {
    voteCountry: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: mockUserModel },
        { provide: CountryService, useValue: mockCountryService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and vote for the country', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@test.com',
        country: 'CountryX',
      };
      const user = { _id: '1', ...createUserDto };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(user);
      mockCountryService.voteCountry.mockResolvedValue(undefined);

      const result = await service.create(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        email: createUserDto.email,
        country: createUserDto.country,
      });
      expect(mockCountryService.voteCountry).toHaveBeenCalledWith(
        createUserDto.country,
      );
      expect(result).toEqual(user);
    });

    it('should throw an error if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@test.com',
        country: 'CountryX',
      };
      const user = { _id: '1', ...createUserDto };

      mockUserModel.findOne.mockResolvedValue(user);

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
    });
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          _id: '1',
          name: 'test',
          email: 'test1@test1.com',
          country: 'CountryX',
        },
      ];

      mockUserModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(users),
        }),
      });

      const result = await service.getAll();
      expect(result).toEqual(users);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });
});
