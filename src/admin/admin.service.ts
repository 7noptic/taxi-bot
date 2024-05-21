import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admin.model';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { genSalt, hash } from 'bcryptjs';
import { QueryType, ResponseType } from '../types/query.type';

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

	async getByEmail(email: string) {
		return this.adminModel.findOne({ email });
	}

	async findByName(email: string) {
		return this.adminModel
			.find({ email: { $regex: email, $options: 'i' } })
			.limit(40)
			.sort({ createdAt: -1 });
	}

	async getLimitAll(currentPageInQuery?: QueryType['currentPage']): Promise<ResponseType<Admin[]>> {
		const perPageCount = 10;
		const currentPage = Number(currentPageInQuery) || 1;
		const skip = perPageCount * (currentPage - 1);

		const admins: Admin[] = await this.adminModel
			.find()
			.sort({ createdAt: -1 })
			.limit(perPageCount)
			.skip(skip);
		const total = await this.adminModel.countDocuments();

		return { data: admins, total, currentPage, perPageCount };
	}

	async getAll() {
		return this.adminModel.find().sort({ createdAt: -1 });
	}
}
