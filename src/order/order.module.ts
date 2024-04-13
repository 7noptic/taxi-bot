import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.model';
import { ShortIdModule } from '../short-id/short-id.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), ShortIdModule],
	controllers: [OrderController],
	providers: [OrderService],
	exports: [OrderService],
})
export class OrderModule {}
