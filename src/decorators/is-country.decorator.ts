import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@ValidatorConstraint({ name: 'isCountry', async: true })
@Injectable()
export class IsCountryConstraint implements ValidatorConstraintInterface {
  async validate(value: string) {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
      await client.connect();
      const database = client.db('country-votes');
      const collection = database.collection('countries');
      const country = await collection.findOne({ name: value });
      return !!country;
    } catch (error) {
      console.error('Error validating country:', error);
      return false;
    } finally {
      await client.close();
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid country`;
  }
}

export function IsCountry(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCountry',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCountryConstraint,
    });
  };
}
