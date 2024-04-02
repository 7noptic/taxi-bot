import { Passenger } from '../../passenger/passenger.model';
import { Driver } from '../../driver/driver.model';

export class FindAppealDto {
	from: Passenger | Driver;
	limit: number;
}
