import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserIdDto } from '../dto/user_id.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signin')
	signin(@Body() { UserId } : UserIdDto) {
		console.log('UserId = ', UserId)
		return this.authService.signin(UserId);
	}

	@Get('dc')
	dc() {
		return this.authService.dc();
	}
}
