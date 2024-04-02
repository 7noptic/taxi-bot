import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { defaultCityPrice } from '../constants/default.constants';

export type CityDocument = HydratedDocument<City>;

@Schema()
export class City {
	@Prop({ type: String, unique: true })
	name: string;

	@Prop({ type: String, default: defaultCityPrice })
	minPrice: number;
}

export const CitySchema = SchemaFactory.createForClass(City);
