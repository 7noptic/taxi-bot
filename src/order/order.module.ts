import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.model';
import { ShortIdModule } from '../short-id/short-id.module';
import { DriverModule } from '../driver/driver.module';
import { SettingsModule } from '../settings/settings.module';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
		ShortIdModule,
		DriverModule,
		SettingsModule,
	],
	controllers: [OrderController],
	providers: [OrderService, LoggerService],
	exports: [OrderService],
})
export class OrderModule {}
