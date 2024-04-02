import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './driver.model';
import { Model } from 'mongoose';

@Injectable()
export class DriverService {
	constructor(@InjectModel(Driver.name) private driverModel: Model<DriverDocument>) {}
}
