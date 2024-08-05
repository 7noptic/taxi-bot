import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
	@Prop(Number)
	chatId: number;

	@Prop(String)
	text: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
