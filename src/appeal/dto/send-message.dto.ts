import { MessagesDto } from './create-appeal.dto';
import { PassengerDocument } from '../../passenger/passenger.model';
import { AdminDocument } from '../../admin/admin.model';
import { IsNumber, IsString } from 'class-validator';

export class SendMessageDto implements Omit<MessagesDto, 'date'> {
	@IsString()
	from: PassengerDocument['chatId'] | AdminDocument['_id'];

	@IsString()
	text: string;

	@IsNumber()
	chatId: number;
}
