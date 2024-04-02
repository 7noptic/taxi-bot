import { IsString } from 'class-validator';

export class FindCityDto {
	@IsString()
	name: string;
}
