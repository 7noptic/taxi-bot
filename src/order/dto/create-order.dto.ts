import { TypeOrder } from '../Enum/type-order';
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

	@IsNumber()
	passengerId: number;

	@IsString()
	city: string;
}
