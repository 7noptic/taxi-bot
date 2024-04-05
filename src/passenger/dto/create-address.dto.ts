import { IsString, Length } from 'class-validator';
import { STRING_LENGTH_ERROR } from '../../constants/default.constants';

export class CreateAddressDto {
	@IsString()
	name: string;

	@IsString()
	@Length(10, 300, { message: STRING_LENGTH_ERROR('адреса') })
	address: string;
}
