import { Module } from '@nestjs/common';
import { ShortIdService } from './short-id.service';

@Module({
	providers: [ShortIdService],
	exports: [ShortIdService],
})
export class ShortIdModule {}
