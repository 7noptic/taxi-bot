import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdminDocument } from '../admin/admin.model';
import { NOT_FOUND_ERROR } from '../constants/default.constants';
import { compare } from 'bcryptjs';
import { WRONG_PASSWORD_ERROR } from './auth.constants';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly adminService: AdminService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string): Promise<Pick<AdminDocument, 'email'>> {
		const user = await this.adminService.findAdminByEmail(email);

		if (!user) {
			throw new NotFoundException(NOT_FOUND_ERROR('администратор'));
		}

		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return { email: user.email };
	}

	async login(email: string) {
		const payload = { email };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
