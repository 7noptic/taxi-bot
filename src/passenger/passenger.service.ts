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
		const user = this.passengerModel.findOne({ chatId }).exec();
	}

	async findByChatId(chatId: number) {
		return await this.passengerModel.findOne({ chatId }).exec();
	}
}
