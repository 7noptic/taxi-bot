import { TypeOrder } from './Enum/type-order';
import { StatusOrder } from './Enum/status-order';
import { Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

	@Prop({ type: String, ref: Passenger.name })
	passengerId: Passenger['chatId'];

	@Prop({ type: String, ref: Driver.name })
	driverId: Driver['chatId'];

	@Prop({ type: Number })
	commission: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
