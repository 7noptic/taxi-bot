import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { City, CityDocument } from './city.model';
import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';

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
		return this.cityModel.find({ name }).exec();
	}

	async deleteById(id: string) {
		return this.cityModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateCityDto) {
		return this.cityModel.findByIdAndUpdate(id, dto).exec();
	}
}
