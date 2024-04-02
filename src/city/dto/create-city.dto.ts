import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCityDto {
	@IsString()
	name: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100_000)
	minPrice?: number;
}
