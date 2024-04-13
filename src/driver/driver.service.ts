import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './driver.model';
import { Model } from 'mongoose';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriverService {
	constructor(@InjectModel(Driver.name) private driverModel: Model<DriverDocument>) {}

	async create(dto: CreateDriverDto) {
		return this.driverModel.create(dto);
	}

	async findByChatId(chatId: number) {
		return await this.driverModel.findOne({ chatId }).exec();
	}
}
