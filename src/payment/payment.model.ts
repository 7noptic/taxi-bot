import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
	@Prop({ type: Number })
	chatId: number;
	@Prop({ type: Number })
	price: number;
	@Prop({ type: String, unique: true })
	numberPayment: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
