import { Controller, Get, Post, Body, UseGuards, Res, Param, HttpCode, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtGuard } from '../guard/jwt.guard';
import { User } from '../entities/user.entity';
import { CodeDto } from '../dto/code.dto'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@UseGuards(JwtGuard)
	@Post('validate')
	async validate() {
		return 'valid'; 
	}

	@Post('create_cookie')
	async create_cookie(@Body() user: any, @Res({ passthrough: true }) response: Response) {
		const jwt = await this.authService.create_cookie(user);
		console.log(jwt);
		response.cookie('my_cooky', jwt);
		return { msg: "cooky sent?" };
	}

	@Post('clear_cookie')
	async clear_cookie(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('my_cooky');
		return { msg: 'cookies cleared' }
	}

	@Get(':code')
	async auth(@Param() code) {
		const get_access_token = async () => {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					grant_type: "authorization_code",
					client_id: process.env.REACT_APP_UID42,
					client_secret: process.env.REACT_APP_SECRET42,
					code: code.code,
					redirect_uri: `http://${process.env.REACT_APP_POSTURL}:3000/page1`
					// "access_token":code.code
					// "token_type":"bearer",
					// "expires_in":7200,
					// "scope":"public",
					// "created_at":Date.now()
				})
				//body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_UID42}&client_secret=${process.env.REACT_APP_SECRET42}&code=${code.code}&redirect_uri=http%3A%2F%2F10.18.198.79%3A3000%2Fpage1`
			};
			console.log(requestOptions)
			const response = await fetch(
				"https://api.intra.42.fr/oauth/token",
				requestOptions
			);
			const data = await response.json();
			return data['access_token'];
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
		return (await get_user_info(await get_access_token()));
	}
}
