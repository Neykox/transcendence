import { Controller, Get, Post, Body, UseGuards, Res, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UserIdDto } from '../dto/user_id.dto';
import { JwtGuard } from '../guard/jwt.guard';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('create_cookie')
	async create_cookie(@Body() user: User, @Res({passthrough: true}) response: Response) {
		const jwt = await this.authService.create_cookie(user);
		response.cookie('my_cooky', jwt, {httpOnly: true});
		return {msg: "cooky sent?"};
	}

	@Post('clear_cookie')
	async clear_cookie(@Res({passthrough: true}) response: Response)
	{
		response.clearCookie('my_cooky');
		return {msg: 'cookies cleared'}
	}

	@Post()
	async auth(@Body() code) {
		const get_access_token = async () => {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					grant_type: "authorization_code",
					client_id: process.env.REACT_APP_UID42,
					client_secret: process.env.REACT_APP_SECRET42,
					// code,
					redirect_uri: `http://${process.env.REACT_APP_POSTURL}:3000/page1`,
					"access_token":code
					// "token_type":"bearer",
					// "expires_in":7200,
					// "scope":"public",
					// "created_at":Date.now()
				}),
			};
			const response = await fetch(
				"https://api.intra.42.fr/oauth/token",
				requestOptions
			);
			const data = await response.json();
			return data.access_token;
		};
	
	
	
		const get_user_info = async (access_token) => {
			const requestOptions = {
				method: "GET",
				headers: { Authorization: `Bearer ${access_token}` },
			};
			const response = await fetch(
				"https://api.intra.42.fr/v2/me",
				requestOptions
			);
			return response.json();
		};
		console.log(code);
		return (get_user_info(get_access_token()));
	}
}
