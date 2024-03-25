import typeOrder from './Enum/type-order';
import { IAddress } from '../user/passenger/interface/address.interface';

export class OrderModel {
	_id: string;
	type: typeOrder;
	addressFrom: IAddress;
	addressTo: IAddress;
	comment: string;
	price: number;
}
