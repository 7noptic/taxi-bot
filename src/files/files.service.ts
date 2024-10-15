import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
	async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
		const nameFolder = 'images';
		const uploadFolder = `${path}/uploads/${nameFolder}`;

		await ensureDir(uploadFolder);
		const res: FileElementResponse[] = [];

		for (const file of files) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			res.push({ url: `${nameFolder}/${file.originalname}`, name: file.originalname });
		}

		return res;
	}

	async convertToWebP(file: Buffer): Promise<Buffer> {
		return sharp(file).webp().toBuffer();
	}
}
