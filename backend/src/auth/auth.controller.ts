import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('signin')
	signin() {
		return this.authService.signin();
	}

	@Get('dc')
	dc() {
		return this.authService.dc();
	}
}
