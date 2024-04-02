import { MessagesDto } from './create-appeal.dto';
import { PassengerDocument } from '../../passenger/passenger.model';
import { AdminDocument } from '../../admin/admin.model';
import { IsString } from 'class-validator';

export class SendMessageDto implements Omit<MessagesDto, 'date'> {
	@IsString()
	from: PassengerDocument['_id'] | AdminDocument['_id'];

	@IsString()
	text: string;
}
