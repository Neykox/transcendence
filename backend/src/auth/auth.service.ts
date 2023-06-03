import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
	constructor ( private jwtService: JwtService, private configService: ConfigService) {}

	async create_cookie(user: User) {
		console.log('create cookie user = ', user)
		// const user = await this.usersService.findOne(userId);
		// if (!user) {
		// 	return { message: 'need to create user' };
		// 	// user = await this.usersService.createUser(request);
		// }
		const payload = { id: user.id, username: user.login };
		return await this.jwtService.signAsync(payload, { secret: 'secret'/*await this.configService.get('JWT_SECRET')*/, expiresIn: '120s'});
	}
}
