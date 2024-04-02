import { PassengerDocument } from '../../passenger/passenger.model';
import { DriverDocument } from '../../driver/driver.model';
import { Order } from '../../order/order.model';
import { AdminDocument } from '../../admin/admin.model';
import { IsArray, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MessagesDto {
	@IsString()
	from: PassengerDocument['_id'] | AdminDocument['_id'];

	@IsString()
	text: string;

	@IsDate()
	date: Date;
}

export class CreateAppealDto {
	@IsString()
	@IsOptional()
	numberOrder?: Order['numberOrder'];

	@IsString()
	from: PassengerDocument['_id'] | DriverDocument['_id'];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MessagesDto)
	messages: MessagesDto[];
}
