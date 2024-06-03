import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsCountry } from '../../../decorators/is-country.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsCountry({
    message: 'It must be a valid country.',
  })
  readonly country: string;
}
