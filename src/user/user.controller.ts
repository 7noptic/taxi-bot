import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserModel } from './user.model';

@Controller('user')
export class UserController {
	@Get(':id')
	async get(@Param('id') id: UserModel['_id']) {}

	@Delete(':id')
	async delete(@Param('id') id: UserModel['_id']) {}
}
