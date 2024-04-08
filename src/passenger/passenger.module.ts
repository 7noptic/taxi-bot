import { Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Passenger, PassengerSchema } from './passenger.model';
import { PassengerAdapter } from './passenger.adapter';

@Module({
	imports: [MongooseModule.forFeature([{ name: Passenger.name, schema: PassengerSchema }])],
	controllers: [PassengerController],
	providers: [PassengerService, PassengerAdapter],
	exports: [PassengerService, PassengerAdapter],
})
export class PassengerModule {}
