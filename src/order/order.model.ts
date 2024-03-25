import typeOrder from '../types/Enum/typeOrder';
import { AddressModel } from '../address/address.model';

export class OrderModel {
	type: typeOrder;
	addressFrom: AddressModel;
	addressTo: AddressModel;
	comment: string;
	price: number;
}
