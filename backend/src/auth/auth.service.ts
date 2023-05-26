import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
	constructor ( private usersService: UsersService, private jwtService: JwtService, private configService: ConfigService) {}

	async signin(userId: number) {
		console.log('userId = ', userId)
		const user = await this.usersService.findOne(userId);
		if (!user) {
			return { message: 'need to create user' };
			// user = await this.usersService.createUser(request);
		}
		if (user.is2FaActive === false)
		{
			const payload = { id: user.id, username: user.pseudo };
			return { access_token: await this.jwtService.signAsync(payload/*, { secret: await this.configService.get('JWT_SECRET'), expiresIn: '60s'}*/) };
		}
		return { message: 'need to valide two fa' };
	}

	dc() {
		return { message: 'bye bye' };
	}
}
