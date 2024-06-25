import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ConstantsService } from '../constants/constants.service';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
	@Prop({ type: String, default: ConstantsService.admin })
	name: string;

	@Prop({ type: String, unique: true })
	email: string;

	@Prop(String)
	passwordHash: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
