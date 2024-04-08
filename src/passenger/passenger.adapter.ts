import { CreatePassengerDto } from './dto/create-passenger.dto';

export class PassengerAdapter {
	convertRegisterInfoToPassenger(info: any): CreatePassengerDto {
		console.log(info);
		const dto = {
			username: info.username,
			phone: info.phone,
			chatId: info.id,
			first_name: info.first_name,
			last_name: info.last_name,
			city: info.city,
		};
		return dto;
	}
}
