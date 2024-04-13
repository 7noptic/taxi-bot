import { CreateDriverDto } from './dto/create-driver.dto';

export class DriverAdapter {
	convertRegisterInfoToDriver(info: any): CreateDriverDto {
		return {
			username: info.username,
			phone: info.phone,
			chatId: info.id,
			first_name: info.first_name,
			last_name: info.last_name,
			city: info.city,
			carNumber: info.carNumber,
			carBrand: info.carBrand,
			carColor: info.carColor,
		};
	}
}
