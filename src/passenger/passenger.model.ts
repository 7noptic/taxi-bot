import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City } from '../city/city.model';
import { HydratedDocument } from 'mongoose';
import { defaultRating } from '../constants/default.constants';

export type PassengerDocument = HydratedDocument<Passenger>;

export class Address {
	@Prop(String)
	name: string;

	@Prop({ type: City })
	city: City;

	@Prop({ type: String, required: false })
	district?: string;

	@Prop({ type: String, required: false })
	street?: string;

	@Prop({ type: String, required: false })
	house?: string;

	@Prop({ type: String, required: false })
	entrance?: string;

	@Prop({ type: String, required: false })
	comment?: string;

	@Prop(String)
	address: string;
}

@Schema({ timestamps: true })
export class Passenger {
	@Prop({ type: String, default: '' })
	username: string;

	@Prop({ type: String, unique: true })
	phone: string;

	@Prop({ type: String, unique: true })
	chatId: string;

	@Prop({ type: String, default: '' })
	first_name: string;

	@Prop({ type: String, default: '' })
	last_name: string;

	@Prop({ type: City })
	city: City;

	@Prop({ type: [Number], default: defaultRating, _id: false })
	rating: number[];

	@Prop({ type: () => [Address], default: [] })
	address: Address[];
}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);
