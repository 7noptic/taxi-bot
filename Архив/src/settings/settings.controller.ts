import { Body, Controller, Get, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { UpdatePriceTextDto } from './dto/update-price-text.dto';
import { UpdateFaqTextDto } from './dto/update-faq-text.dto';
import { UpdateSupportTextDto } from './dto/update-support-text.dto';
import { UpdateAboutTextDto } from './dto/update-about-text.dto';
import { LoggerService } from '../logger/logger.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('settings')
export class SettingsController {
	constructor(
		private readonly settingsService: SettingsService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('')
	async getSettings() {
		try {
			return this.settingsService.getSettings();
		} catch (e) {
			this.loggerService.error('getSettings Settings: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updateCommission')
	async updateCommission(@Body() dto: UpdateCommissionDto) {
		try {
			return this.settingsService.updateSettings(dto);
		} catch (e) {
			this.loggerService.error('updateCommission Settings: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updatePriceText')
	async updatePriceText(@Body() dto: UpdatePriceTextDto) {
		try {
			return this.settingsService.updateSettings(dto);
		} catch (e) {
			this.loggerService.error('updatePriceText Settings: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updateFaqText')
	async updateFaqText(@Body() dto: UpdateFaqTextDto) {
		try {
			return this.settingsService.updateSettings(dto);
		} catch (e) {
			this.loggerService.error('updateFaqText Settings: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updateSupportText')
	async updateSupportText(@Body() dto: UpdateSupportTextDto) {
		try {
			return this.settingsService.updateSettings(dto);
		} catch (e) {
			this.loggerService.error('updateSupportText Settings: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updateAboutText')
	async updateAboutText(@Body() dto: UpdateAboutTextDto) {
		try {
			return this.settingsService.updateSettings(dto);
		} catch (e) {
			this.loggerService.error('updateAboutText Settings: ' + e?.toString());
		}
	}
}
