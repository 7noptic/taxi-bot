import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
	aboutTextDefault,
	faqTextDefault,
	priceTextDefault,
	supportTextDefault,
} from '../constants/default.constants';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true })
export class Settings {
	@Prop({ type: Number, default: 0 })
	commission: number;

	@Prop({ type: String, default: priceTextDefault })
	priceText: string;

	@Prop({ type: String, default: faqTextDefault })
	faqText: string;

	@Prop({ type: String, default: aboutTextDefault })
	aboutText: string;

	@Prop({ type: String, default: supportTextDefault })
	supportText: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
