import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentStatus } from './enum/payment-status';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
	@Prop({ type: Number })
	chatId: number;
	@Prop({ type: Number })
	price: number;
	@Prop({ type: Number })
	countOrder: number;
	@Prop({ type: String, unique: true })
	numberPayment: string;
	@Prop({ enum: PaymentStatus, default: PaymentStatus.NotPaid })
	status: PaymentStatus;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
