import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City } from '../city/city.model';
import { HydratedDocument } from 'mongoose';
import { defaultRating } from '../constants/default.constants';

export type PassengerDocument = HydratedDocument<Passenger>;

export class Address {
	@Prop({ type: String, unique: true })
	name: string;

	@Prop(String)
	address: string;
}

@Schema({ timestamps: true })
export class Passenger {
	@Prop({ type: String, default: '' })
	username: string;

	@Prop({ type: String })
	phone: string;

	@Prop({ type: Number, unique: true })
	chatId: number;

	@Prop({ type: String, default: '' })
	first_name: string;

	@Prop({ type: String, default: '' })
	last_name: string;

	@Prop({ type: String, ref: City.name })
	city: City['name'];

	@Prop({ type: [Number], default: defaultRating, _id: false })
	rating: number[];

	@Prop({ type: () => [Address], default: [] })
	address: Address[];
}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);
