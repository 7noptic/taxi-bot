import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, Passenger, PassengerDocument } from './passenger.model';
import { Model } from 'mongoose';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { ConstantsService } from '../constants/constants.service';
import { getFullPassengerInfoPipeline } from './piplines/getFullPassengerInfo.pipeline';
import { QueryType, ResponseType } from '../types/query.type';

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

	async findAddressByName(
		chatId: Passenger['chatId'],
		addressName: Address['name'],
	): Promise<Address['address']> {
		const passenger = await this.passengerModel.findOne({ chatId }).exec();
		return passenger?.address?.find((address) => address.name === addressName)?.address || '';
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

	async update(chatId: number, updatedPassenger: Partial<Passenger>) {
		return this.passengerModel
			.findOneAndUpdate({ chatId }, { $set: updatedPassenger }, { new: true })
			.exec();
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

	async getLimitAll(
		currentPageInQuery?: QueryType['currentPage'],
	): Promise<ResponseType<Passenger[]>> {
		const perPageCount = 10;
		const currentPage = Number(currentPageInQuery) || 1;
		const skip = perPageCount * (currentPage - 1);

		const passengers: Passenger[] = await this.passengerModel
			.find()
			.sort({ createdAt: -1 })
			.limit(perPageCount)
			.skip(skip);
		const total = await this.passengerModel.countDocuments();

		return { data: passengers, total, currentPage, perPageCount };
	}

	async getAll() {
		return this.passengerModel.find().sort({ createdAt: -1 });
	}

	async getFullPassengerInfo(chatId: number) {
		return (
			await this.passengerModel.aggregate(getFullPassengerInfoPipeline(chatId)).exec()
		)[0] as Passenger & {
			receivedReview: number;
			leftReview: number;
		};
	}

	async getAllPassengersId() {
		return this.passengerModel.find({}, 'chatId').exec();
	}
}
