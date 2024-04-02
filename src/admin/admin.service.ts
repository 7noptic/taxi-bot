import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admin.model';
import { Model } from 'mongoose';
import { Auth } from '../auth/auth.model';

@Injectable()
export class AdminService {
	constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

	async create(dto: Auth) {
		return this.adminModel.create(dto);
	}
}
