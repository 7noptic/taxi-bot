import { Body, Controller, Get, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { UpdatePriceTextDto } from './dto/update-price-text.dto';
import { UpdateFaqTextDto } from './dto/update-faq-text.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { UpdateSupportTextDto } from './dto/update-support-text.dto';

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('')
	async getSettings() {
		return this.settingsService.getSettings();
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updateCommission')
	async updateCommission(@Body() dto: UpdateCommissionDto) {
		return this.settingsService.updateSettings(dto);
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updatePriceText')
	async updatePriceText(@Body() dto: UpdatePriceTextDto) {
		return this.settingsService.updateSettings(dto);
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updateFaqText')
	async updateFaqText(@Body() dto: UpdateFaqTextDto) {
		return this.settingsService.updateSettings(dto);
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updateFaqText')
	async updateSupportText(@Body() dto: UpdateSupportTextDto) {
		return this.settingsService.updateSettings(dto);
	}
}
