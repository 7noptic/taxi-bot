import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appeal, AppealDocument } from './appeal.model';
import { Model } from 'mongoose';
import { CreateAppealDto, MessagesDto } from './dto/create-appeal.dto';
import { ShortIdService } from '../short-id/short-id.service';
import { TypeId } from '../short-id/Enums/type-id.enum';
import { SendMessageDto } from './dto/send-message.dto';
import { APPEAL_NOT_FOUND } from './appeal.constants';

@Injectable()
export class AppealService {
	constructor(
		@InjectModel(Appeal.name) private appealModel: Model<AppealDocument>,
		private readonly shortIdService: ShortIdService,
	) {}

	async create(dto: CreateAppealDto) {
		const numberAppeal = this.shortIdService.generateUniqueId(TypeId.Appeal);
		return this.appealModel.create({ ...dto, numberAppeal });
	}

	async findById(id: string) {
		return this.appealModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.appealModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: Partial<CreateAppealDto>) {
		return this.appealModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async sendMessage(id: string, dto: SendMessageDto) {
		const message: MessagesDto = {
			from: dto.from,
			text: dto.text,
			date: new Date(),
		};

		const updatedAppeal = await this.appealModel
			.findByIdAndUpdate(
				id,
				{ $push: { messages: { $each: [message], $position: 0 } } },
				{ new: true },
			)
			.exec();

		if (!updatedAppeal) {
			throw new NotFoundException(APPEAL_NOT_FOUND);
		}

		return updatedAppeal;
	}
}
