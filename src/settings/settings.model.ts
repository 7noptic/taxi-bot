import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ConstantsService } from '../constants/constants.service';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true })
export class Settings {
	@Prop({ type: Number, default: 0 })
	commission: number;

	@Prop({ type: String, default: ConstantsService.priceTextDefault })
	priceText: string;

	@Prop({ type: String, default: ConstantsService.faqTextDefault })
	faqText: string;

	@Prop({ type: String, default: ConstantsService.aboutTextDefault })
	aboutText: string;

	@Prop({ type: String, default: ConstantsService.supportTextDefault })
	supportText: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
