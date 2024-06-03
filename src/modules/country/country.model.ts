import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema()
export class Country {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  official_name: string;

  @Prop({ type: [String] })
  capital: string[];

  @Prop({ type: String })
  region: string;

  @Prop({ type: String })
  subregion: string;

  @Prop({ type: Number, default: 0 })
  votes: number;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
