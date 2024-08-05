import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Driver } from '../driver/driver.model';
import { Passenger } from '../passenger/passenger.model';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
	@Prop({ type: Types.ObjectId, ref: Driver.name || Passenger.name })
	id: string;

	@Prop(String)
	text: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
