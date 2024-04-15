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

	async editName(chatId: Driver['chatId'], new_name: Driver['first_name']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					first_name: new_name,
				},
			},
		);
	}

	async editPhone(chatId: Driver['chatId'], new_phone: Driver['phone']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					phone: new_phone,
				},
			},
		);
	}

	async editCity(chatId: Driver['chatId'], new_city: Driver['city']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					city: new_city,
				},
			},
		);
	}

	async editAccessTypeOrder(chatId: Driver['chatId'], new_access_type: Driver['accessOrderType']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					accessOrderType: new_access_type,
				},
			},
		);
	}

	async editCar(chatId: Driver['chatId'], new_car: Driver['car']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					car: new_car,
				},
			},
		);
	}
}
