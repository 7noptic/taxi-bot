import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings, SettingsDocument } from './settings.model';
import { Model } from 'mongoose';

@Injectable()
export class SettingsService {
	constructor(@InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>) {}

	async initializeSettings() {
		const existingSettings = await this.settingsModel.findOne();
		if (!existingSettings) {
			await this.settingsModel.create({});
		}
	}

	async getSettings() {
		return this.settingsModel.findOne();
	}

	async updateSettings(newSettings: Partial<Settings>) {
		return this.settingsModel.findOneAndUpdate({}, newSettings, { new: true });
	}
}
