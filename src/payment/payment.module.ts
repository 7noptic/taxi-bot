import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.model';
import { PaymentController } from './payment.controller';
import { ShortIdModule } from '../short-id/short-id.module';
import { DriverModule } from '../driver/driver.module';
import { BullModule } from '@nestjs/bull';
import { QueueType } from '../types/queue.type';
import { PaymentProcessor } from './processor/payment.processor';
import { OrderModule } from '../order/order.module';
import { BlockedProcessor } from './processor/blocked.processor';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
		BullModule.registerQueue(
			{
				name: QueueType.Payment,
			},
			{
				name: QueueType.Blocked,
			},
		),
		ShortIdModule,
		DriverModule,
		OrderModule,
	],
	providers: [PaymentService, PaymentProcessor, BlockedProcessor],
	controllers: [PaymentController],
	exports: [PaymentService],
})
export class PaymentModule {}
