import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City } from '../city/city.model';
import { HydratedDocument } from 'mongoose';
import { ConstantsService } from '../constants/constants.service';
import { StatusDriver } from '../taxi-bot/types/status-driver.type';

export type DriverDocument = HydratedDocument<Driver>;

export class Car {
	@Prop({ type: String, required: true })
	carBrand: string;

	@Prop({ type: String, required: true })
	carColor: string;

	@Prop({ type: String, required: true })
	carNumber: string;
}

@Schema({ timestamps: true })
export class Driver {
	@Prop({ type: String, default: '' })
	username: string;

	@Prop({ type: String })
	phone: string;

	@Prop({ type: Number, unique: true })
	chatId: number;

	@Prop({ type: String })
	first_name: string;

	@Prop({ type: String, default: '' })
	last_name: string;

	@Prop({ type: String, ref: City.name })
	city: City['name'];

	@Prop({ type: [Number], default: ConstantsService.defaultRating, _id: false })
	rating: number[];

	@Prop({ enum: StatusDriver, default: StatusDriver.Offline })
	status: StatusDriver;

	@Prop({ type: Number, default: 0 })
	commission: number;

	@Prop({ type: Car })
	car: Car;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
