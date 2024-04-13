import { TypeOrder } from '../Enum/type-order';
import { Address, Passenger } from '../../passenger/passenger.model';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
	@IsEnum(TypeOrder)
	type: TypeOrder;

	@ValidateNested()
	@Type(() => Address)
	addressFrom: Address['address'];

	@ValidateNested()
	@Type(() => Address)
	addressTo: Address['address'];

	@IsString()
	@IsOptional()
	comment: string;

	@IsNumber()
	price: number;

	@ValidateNested()
	@Type(() => Passenger['chatId'])
	passengerId: Passenger['chatId'];
}
