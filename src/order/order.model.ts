import { TypeOrder } from './Enum/type-order';
import { StatusOrder } from './Enum/status-order';
import { Address, Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
	@Prop(String)
	numberOrder: string;

	@Prop({ enum: TypeOrder })
	type: TypeOrder;

	@Prop({ type: Address })
	addressFrom: Address;

	@Prop({ type: Address })
	addressTo: Address;

	@Prop({ type: String })
	comment: string;

	@Prop({ type: Number })
	price: number;

	@Prop({ enum: StatusOrder })
	status: StatusOrder;

	@Prop({ type: Types.ObjectId, ref: Passenger.name })
	passengerId: Passenger;

	@Prop({ type: Types.ObjectId, ref: Driver.name })
	driverId: Driver;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
