import { Passenger, PassengerDocument } from '../passenger/passenger.model';
import { Driver, DriverDocument } from '../driver/driver.model';
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from '../admin/admin.model';

export type AppealDocument = HydratedDocument<Appeal>;

export enum StatusAppeal {
	Open = 'open',
	Close = 'close',
}

export class Message {
	@Prop({ type: Types.ObjectId, ref: Passenger.name || Admin.name })
	from: Passenger | Admin;

	@Prop(String)
	text: string;

	@Prop(Date)
	date: Date;
}

@Schema({ timestamps: true })
export class Appeal {
	@Prop({ type: [Message], default: [] })
	messages: Message[];

	@Prop({ type: String, unique: true })
	numberAppeal: string;

	@Prop({ type: String })
	numberOrder: string;

	@Prop({ type: String, enum: Object.values(StatusAppeal), default: StatusAppeal.Open })
	status: StatusAppeal;

	@Prop({ type: Types.ObjectId, ref: Passenger.name || Driver.name })
	from: PassengerDocument['chatId'] | DriverDocument['chatId'];
}

export const AppealSchema = SchemaFactory.createForClass(Appeal);
