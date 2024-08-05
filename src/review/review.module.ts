import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './review.model';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }])],
	controllers: [ReviewController],
	providers: [ReviewService, LoggerService],
	exports: [ReviewService],
})
export class ReviewModule {}
