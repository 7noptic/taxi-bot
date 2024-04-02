import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City } from '../city/city.model';
import { defaultRating } from '../constants/default.constants';
import { HydratedDocument } from 'mongoose';

export type DriverDocument = HydratedDocument<Driver>;

export class Car {
	@Prop({ type: String, required: true })
	carBrand: string;

	@Prop({ type: String, required: true })
	carColor: string;

	@Prop({ type: String, required: true })
	carNumber: string;
}

@Schema()
export class Driver {
	@Prop({ type: String, default: '' })
	username: string;

	@Prop({ type: String, unique: true })
	phone: string;

	@Prop(String)
	chatId: string;

	@Prop({ type: String, default: '' })
	first_name: string;

	@Prop({ type: String, default: '' })
	last_name: string;

	@Prop({ type: City })
	city: City;

	@Prop({ type: [Number], default: defaultRating })
	rating: number[];

	@Prop({ type: Car })
	car: Car;
}

export const DriverSchema = SchemaFactory.createForClass(SchemaFactory);
