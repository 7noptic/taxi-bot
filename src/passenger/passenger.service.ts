import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Passenger, PassengerDocument } from './passenger.model';
import { Model } from 'mongoose';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { ConstantsService } from '../constants/constants.service';

@Injectable()
export class PassengerService {
	constructor(@InjectModel(Passenger.name) private passengerModel: Model<PassengerDocument>) {}

	async create(dto: CreatePassengerDto) {
		try {
			const user = await this.passengerModel.create(dto);
			return user;
		} catch (e) {
			console.log('error', e);
		}
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
		const lowerCaseAddressName = addressName.toLowerCase();

		const afterUpdate = await this.passengerModel
			.findOneAndUpdate(
				{ chatId },
				{
					$pull: {
						address: { name: { $regex: new RegExp('^' + lowerCaseAddressName + '$', 'i') } },
					},
				},
				{ new: true },
			)
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

	async getRatingById(chatId: number) {
		const { rating } = await this.passengerModel.findOne({ chatId }, { rating: 1 }).lean();
		if (rating) {
			return ConstantsService.getUserRating(rating);
		}
		return '0';
	}

	async addRating(chatId: number, rating: number) {
		return this.passengerModel.findOneAndUpdate(
			{ chatId },
			{ $push: { rating: { $each: [rating], $position: 0 } } },
			{ new: true },
		);
	}

	async getAll() {
		return this.passengerModel.find();
	}

	async getFullPassengerInfo(chatId: number) {
		console.log(chatId);
		const res = (await this.passengerModel
			.aggregate([
				{
					$match: {
						chatId,
					},
				},
				{
					$lookup: {
						from: 'reviews',
						localField: 'chatId',
						foreignField: 'from',
						as: 'reviewFrom',
					},
				},
				{
					$addFields: {
						leftReview: {
							$size: '$reviewFrom',
						},
					},
				},
				{
					$lookup: {
						from: 'reviews',
						localField: 'chatId',
						foreignField: 'to',
						as: 'reviewTo',
					},
				},
				{
					$addFields: {
						receivedReview: {
							$size: '$reviewTo',
						},
					},
				},
			])
			.exec()) as (Passenger & {
			receivedReview: number;
			leftReview: number;
		})[];
		console.log(res);
		return res;
	}
}
