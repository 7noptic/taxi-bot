import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.model';
import { PaymentController } from './payment.controller';
import { ShortIdModule } from '../short-id/short-id.module';
import { DriverModule } from '../driver/driver.module';
import { OrderModule } from '../order/order.module';
import { LoggerService } from '../logger/logger.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
		// BullModule.registerQueue(
		// 	{
		// 		name: QueueType.Payment,
		// 	},
		// 	{
		// 		name: QueueType.Blocked,
		// 	},
		// ),
		ShortIdModule,
		DriverModule,
		OrderModule,
		SettingsModule,
	],
	providers: [PaymentService, LoggerService],
	controllers: [PaymentController],
	exports: [PaymentService],
})
export class PaymentModule {}
