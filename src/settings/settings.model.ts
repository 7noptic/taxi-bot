import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema()
export class Settings {
	@Prop({ type: Number, default: 0 })
	commission: number;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
