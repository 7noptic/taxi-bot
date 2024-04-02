import { Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { Order, OrderDocument } from '../order/order.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
	@Prop({ type: String, ref: Driver.name || Passenger.name })
	from: Passenger['chatId'] | Driver['chatId'];

	@Prop({ type: String, ref: Driver.name || Passenger.name })
	to: Passenger['chatId'] | Driver['chatId'];

	@Prop({ type: Types.ObjectId, ref: Order.name })
	orderId: OrderDocument['numberOrder'];

	@Prop(String)
	text: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
