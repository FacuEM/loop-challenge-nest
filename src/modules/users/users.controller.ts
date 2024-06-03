import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return newUser;
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get()
  async getAll() {
    try {
      const users = await this.usersService.getAll();
      return users;
    } catch (error) {
      return { message: error.message };
    }
  }
}
