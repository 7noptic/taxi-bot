import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { admin } from '../constants/default.constants';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
	@Prop({ type: String, default: admin })
	name: string;

	@Prop(String)
	email: string;

	@Prop(String)
	passwordHash: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
