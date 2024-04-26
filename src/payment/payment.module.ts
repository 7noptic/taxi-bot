import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.model';
import { DriverModule } from '../driver/driver.module';
import { PaymentController } from './payment.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
		DriverModule,
	],
	providers: [PaymentService],
	controllers: [PaymentController],
})
export class PaymentModule {}
