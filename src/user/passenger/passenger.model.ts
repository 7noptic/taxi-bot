import { UserModel } from '../user.model';
import { IAddress } from './interface/address.interface';

export class PassengerModel extends UserModel {
	address: { [key: string]: IAddress };
}
