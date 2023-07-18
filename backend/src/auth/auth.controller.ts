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
	async auth(@Body() code: number, @Res({passthrough: true}) response: Response) {
		fetch()
	}
}
