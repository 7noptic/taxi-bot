import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Passenger, PassengerDocument } from './passenger.model';
import { Model } from 'mongoose';
import { CreatePassengerDto } from './dto/create-passenger.dto';

@Injectable()
export class PassengerService {
	constructor(@InjectModel(Passenger.name) private passengerModel: Model<PassengerDocument>) {}

	async create(dto: CreatePassengerDto) {
		return this.passengerModel.create(dto);
	}
}
