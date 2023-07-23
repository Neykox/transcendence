import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
	constructor ( private jwtService: JwtService, private configService: ConfigService) {}

	async create_cookie(user: User) {
		// const payload = { id: user.id, username: user.login };
		return await this.jwtService.signAsync({ id: user.id, username: user.login }, { secret: 'secret'/*await this.configService.get('JWT_SECRET')*/, expiresIn: '10h'/*'120s'*/});
	}
}
