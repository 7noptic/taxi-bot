import { TypeOrder } from './Enum/type-order';
import { StatusOrder } from './Enum/status-order';
import { Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { City } from '../city/city.model';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
	@Prop({ type: String, unique: true })
	numberOrder: string;

	@Prop({ enum: TypeOrder })
	type: TypeOrder;

	@Prop({ type: String })
	addressFrom: string;

	@Prop({ type: String })
	addressTo: string;

	@Prop({ type: String })
	comment: string;

	@Prop({ type: Number })
	price: number;

	@Prop({ enum: StatusOrder, default: StatusOrder.Created })
	status: StatusOrder;

	@Prop({ type: Number, ref: Passenger.name })
	passengerId: Passenger['chatId'];

	@Prop({ type: Number, ref: Driver.name })
	driverId: Driver['chatId'];

	@Prop({ type: String, ref: City['name'] })
	city: City['name'];

	@Prop({ type: Number, default: 0 })
	submissionTime: number;

	@Prop({ type: Number })
	commission: number;

	@Prop({ type: Date, default: new Date() })
	findDriverAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
