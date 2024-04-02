import { Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { Order } from '../order/order.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
	@Prop({ type: Types.ObjectId, ref: Driver.name || Passenger.name })
	from: Passenger | Driver;

	@Prop({ type: Types.ObjectId, ref: Driver.name || Passenger.name })
	to: Passenger | Driver;

	@Prop({ type: Types.ObjectId, ref: Order.name })
	orderId: Order;

	@Prop(String)
	text: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
