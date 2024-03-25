import { UserModel } from '../user.model';

export class DriverModel extends UserModel {
	carBrand: string;
	carColor: string;
	carNumber: string;
}
