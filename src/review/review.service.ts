import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './review.model';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
	constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

	async createReview(dto: CreateReviewDto) {
		return this.reviewModel.create(dto);
	}
}
