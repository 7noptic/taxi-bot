import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PassengerModule } from './passenger/passenger.module';
import { DriverModule } from './driver/driver.module';

@Module({
	imports: [PassengerModule, DriverModule],
	controllers: [UserController],
})
export class UserModule {}
