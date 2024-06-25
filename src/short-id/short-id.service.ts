import { Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { TypeId } from './Enums/type-id.enum';

@Injectable()
export class ShortIdService {
	private readonly uid: ShortUniqueId;

	constructor() {
		this.uid = new ShortUniqueId({ length: 6 });
	}

	generateUniqueId(type: TypeId): string {
		return `${type} ${this.uid.rnd()}`;
	}
}
