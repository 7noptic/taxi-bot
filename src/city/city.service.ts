import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { City, CityDocument } from './city.model';
import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { ConstantsService } from '../constants/constants.service';
import { QueryType, ResponseType } from '../types/query.type';

@Injectable()
export class CityService {
	constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>) {}

	async create(dto: CreateCityDto) {
		return this.cityModel.create(dto);
	}

	async getById(id: string) {
		return this.cityModel.findById(id).exec();
	}

	async getByName(name: string) {
		return this.cityModel.findOne({ name }).exec();
	}

	async deleteById(id: string) {
		return this.cityModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: Partial<CreateCityDto>) {
		return this.cityModel.findByIdAndUpdate(id, dto).exec();
	}

	async getMinPriceByName(name: string): Promise<number> {
		const city = await this.cityModel.findOne({ name });
		return city ? city.minPrice : ConstantsService.defaultCityPrice;
	}

	async findByName(name: string) {
		return this.cityModel
			.find({ name: { $regex: name, $options: 'i' } })
			.limit(40)
			.sort({ createdAt: -1 });
	}

	async getLimitAll(currentPageInQuery?: QueryType['currentPage']): Promise<ResponseType<City[]>> {
		const perPageCount = 10;
		const currentPage = Number(currentPageInQuery) || 1;
		const skip = perPageCount * (currentPage - 1);

		const cities: City[] = await this.cityModel
			.find()
			.sort({ name: 1 })
			.limit(perPageCount)
			.skip(skip);
		const total = await this.cityModel.countDocuments();
		return { data: cities, total, currentPage, perPageCount };
	}

	async getAll() {
		return this.cityModel.find().sort({ name: 1 });
	}
}
