import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Get('')
	async getSettings() {
		return this.settingsService.getSettings();
	}

	@Patch('updateCommission')
	async updateCommission(@Body() dto: UpdateCommissionDto) {
		return this.settingsService.updateSettings(dto);
	}
}
