import { IsString } from 'class-validator';

export class UpdatePriceTextDto {
	@IsString()
	priceText: string;
}
