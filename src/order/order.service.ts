import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.model';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
	constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}
}
