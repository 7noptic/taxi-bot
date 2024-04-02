import { MessagesDto } from './create-appeal.dto';
import { PassengerDocument } from '../../passenger/passenger.model';
import { AdminDocument } from '../../admin/admin.model';

export class SendMessageDto implements Omit<MessagesDto, 'date'> {
	from: PassengerDocument['_id'] | AdminDocument['_id'];
	text: string;
}
