import { Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { HydratedDocument, Types } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from '../admin/admin.model';

export type AppealDocument = HydratedDocument<Appeal>;

export class Message {
	@Prop({ type: Types.ObjectId, ref: Passenger.name || Admin.name })
	from: Passenger | Admin;

	@Prop(String)
	text: string;
}

export class Appeal {
	@Prop({ type: [String], default: [] })
	messages: Message[];

	@Prop(String)
	numberAppeal: string;

	@Prop({ type: Types.ObjectId, ref: Passenger.name || Driver.name })
	from: Passenger | Driver;
}

export const AppealSchema = SchemaFactory.createForClass(Appeal);
