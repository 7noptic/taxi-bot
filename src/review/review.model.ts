import { Order, OrderDocument } from '../order/order.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
	@Prop({ type: Number })
	from: number;

	@Prop({ type: Number })
	to: number;

	@Prop({ type: Types.ObjectId, ref: Order.name })
	orderId: OrderDocument['numberOrder'];

	@Prop(String)
	text: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
