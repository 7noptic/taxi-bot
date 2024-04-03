import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admin.model';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class AdminService {
	constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

	async create({ name, email, password }: CreateAdminDto) {
		const salt = await genSalt(10);
		const newAdmin = new this.adminModel({
			name,
			email,
			passwordHash: await hash(password, salt),
		});
		return newAdmin.save();
	}

	async findAdminByEmail(email: string) {
		return this.adminModel.findOne({ email }).exec();
	}

	async findAdminById(id: string) {
		return this.adminModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.adminModel.findByIdAndDelete(id);
	}
}
