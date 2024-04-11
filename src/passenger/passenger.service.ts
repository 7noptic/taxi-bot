import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Passenger, PassengerDocument } from './passenger.model';
import { Model } from 'mongoose';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class PassengerService {
	constructor(@InjectModel(Passenger.name) private passengerModel: Model<PassengerDocument>) {}

	async create(dto: CreatePassengerDto) {
		return this.passengerModel.create(dto);
	}

	async addAddress(chatId: Passenger['chatId'], address: CreateAddressDto) {
		return await this.passengerModel
			.findOneAndUpdate({ chatId }, { $push: { address: address } }, { new: true })
			.exec();
	}

	async deleteAddress(chatId: number, addressName: string): Promise<number> {
		const beforeUpdatePassenger = await this.passengerModel.findOne({ chatId }).exec();

		if (!beforeUpdatePassenger) {
			return 0;
		}

		const initialLength = beforeUpdatePassenger.address.length;

		const afterUpdate = await this.passengerModel
			.findOneAndUpdate({ chatId }, { $pull: { address: { name: addressName } } }, { new: true })
			.exec();

		if (!afterUpdate) {
			return 0;
		}

		const finalLength = afterUpdate.address.length;

		return initialLength - finalLength;
	}

	async editName(chatId: Passenger['chatId'], new_name: Passenger['first_name']) {
		return this.passengerModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					first_name: new_name,
				},
			},
		);
	}

	async editPhone(chatId: Passenger['chatId'], new_phone: Passenger['phone']) {
		return this.passengerModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					phone: new_phone,
				},
			},
		);
	}

	async editCity(chatId: Passenger['chatId'], new_city: Passenger['city']) {
		return this.passengerModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					city: new_city,
				},
			},
		);
	}

	async findByChatId(chatId: number) {
		return await this.passengerModel.findOne({ chatId }).exec();
	}
}
