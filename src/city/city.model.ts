import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ConstantsService } from '../constants/constants.service';

export type CityDocument = HydratedDocument<City>;

@Schema({ timestamps: true })
export class City {
	@Prop({ type: String, unique: true })
	name: string;

	@Prop({ type: Number, default: ConstantsService.defaultCityPrice })
	minPrice: number;
}

export const CitySchema = SchemaFactory.createForClass(City);
