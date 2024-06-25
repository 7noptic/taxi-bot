import { IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { ConstantsService } from '../../constants/constants.service';

export class CreateCityDto {
	@IsString()
	@Length(3, 30, { message: ConstantsService.STRING_LENGTH_ERROR('города') })
	name: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100_000)
	minPrice?: number;
}
