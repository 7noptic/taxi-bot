import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { admin } from '../constants/default.constants';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

export class Admin {
	@Prop({ type: String, default: admin })
	name: string;
	@Prop(String)
	login: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
