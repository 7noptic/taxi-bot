import { Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { UserModule } from '../user.module';
import { DriverModule } from '../driver/driver.module';

@Module({
	imports: [UserModule, DriverModule],
	controllers: [PassengerController],
})
export class PassengerModule {}
