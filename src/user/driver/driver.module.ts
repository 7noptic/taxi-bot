import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { UserModule } from '../user.module';
import { PassengerModule } from '../passenger/passenger.module';

@Module({
	imports: [UserModule, PassengerModule],
	controllers: [DriverController],
})
export class DriverModule {}
