import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { defaultCityPrice } from '../constants/default.constants';

export type CityDocument = HydratedDocument<City>;

@Schema({ timestamps: true })
export class City {
	@Prop({ type: String, unique: true })
	name: string;

	@Prop({ type: Number, default: defaultCityPrice })
	minPrice: number;
}

export const CitySchema = SchemaFactory.createForClass(City);
