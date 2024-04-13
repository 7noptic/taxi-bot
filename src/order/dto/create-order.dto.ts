import { TypeOrder } from '../Enum/type-order';
import { Passenger } from '../../passenger/passenger.model';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
	@IsEnum(TypeOrder)
	type: TypeOrder;

	@IsString()
	addressFrom: string;

	@IsString()
	addressTo: string;

	@IsString()
	@IsOptional()
	comment: string;

	@IsNumber()
	price: number;

	// @ValidateNested()
	// @Type(() => Passenger['chatId'])
	// passengerId: Passenger['chatId'];

	@IsNumber()
	passengerId: Passenger['chatId'];
}
