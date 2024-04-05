import { Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Passenger, PassengerSchema } from './passenger.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: Passenger.name, schema: PassengerSchema }])],
	controllers: [PassengerController],
	providers: [PassengerService],
	exports: [PassengerService],
})
export class PassengerModule {}
