import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';
import axios from 'axios';

export function IsCountry(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCountry',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        async validate(value: string) {
          try {
            return await axios.get(
              `https://restcountries.com/v3.1/name/${value}`,
            );
          } catch (error) {}
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid country`;
        },
      },
    });
  };
}
