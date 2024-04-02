import { TypeOrder } from '../Enum/type-order';
import { Address, Passenger } from '../../passenger/passenger.model';
import { StatusOrder } from '../Enum/status-order';
import { Driver } from '../../driver/driver.model';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
	@IsString()
	numberOrder: string;

	@IsEnum(TypeOrder)
	type: TypeOrder;

	@ValidateNested()
	@Type(() => Address)
	addressFrom: Address;

	@ValidateNested()
	@Type(() => Address)
	addressTo: Address;

	@IsString()
	comment: string;

	@IsNumber()
	price: number;

	@IsEnum(StatusOrder)
	status: StatusOrder;

	@ValidateNested()
	@Type(() => Passenger['chatId'])
	passengerId: Passenger['chatId'];

	@ValidateNested()
	@Type(() => Passenger['chatId'])
	driverId: Driver['chatId'];
}
