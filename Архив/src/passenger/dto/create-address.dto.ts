import { IsString, Length } from 'class-validator';
import { ConstantsService } from '../../constants/constants.service';

export class CreateAddressDto {
	@IsString()
	name: string;

	@IsString()
	@Length(10, 300, { message: ConstantsService.STRING_LENGTH_ERROR('адреса') })
	address: string;
}
