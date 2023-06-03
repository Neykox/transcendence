import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UseGuards,
  Res,
  Req,
  Body,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { TwoFaService } from './two_fa.service';
import { UsersService } from '../users/users.service';
import { TwoFaCodeDto } from '../dto/two_fa_code.dto';
import { UserIdDto } from '../dto/user_id.dto';
import { JwtGuard } from '../guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('two_fa')
export class TwoFaController {
	constructor(private twoFaService: TwoFaService, private usersService: UsersService, private jwtService: JwtService) {}

	@Get('generate_qrcode')
	@UseGuards(JwtGuard)
	// async register(@Res() response: Response, @Req() request: RequestWithUser) {
	async register(@Req() request: Request) {
		const  otpauthUrl  = await this.twoFaService.generate_2Fa_Secret(await this.usersService.findOne(request.user['id']));

		// console.log(otpauthUrl);
		return otpauthUrl;
		// return this.twoFaService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post('turn-on')
	@HttpCode(200)
	@UseGuards(JwtGuard)//should be able to get user info thanks to cookie
	async turnOnTwoFactorAuthentication(@Body() { TwoFaCode } : TwoFaCodeDto, @Res({passthrough: true}) response: Response, @Req() request: Request)
	{
		console.log({TwoFaCode});
		const user = await this.usersService.findOne(request.user['id']);
		const isCodeValid = this.twoFaService.isTwoFactorAuthenticationCodeValid(TwoFaCode, user);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		const jwt = await this.usersService.turnOnTwoFa(user);
		response.cookie('my_cooky', jwt, {httpOnly: true});
		return {msg: "cooky sent?"};
	}

	@Post('turn-off')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async turnOffTwoFactorAuthentication(@Req() request: Request)
	{
		console.log("turn-off user = ", request.user);
		// await this.usersService.turnOffTwoFa((await this.usersService.findOne(1)).id);
		await this.usersService.turnOffTwoFa(request.user['id']);
		return {msg: "turned oof"}
	}

	// @Post('turn-off')
	// @HttpCode(200)
	// // @UseGuards(JwtGuard)
	// async turnOffTwoFactorAuthentication(@Req() request: Request)
	// {
	// 	try {
	// 		const cookie = request.cookies['my_cooky'];

	// 		if (!cookie)
	// 			throw UnauthorizedException;

	// 		const payload = await this.jwtService.verifyAsync(cookie.token, {secret: 'secret'});

	// 		if (!payload)
	// 			throw UnauthorizedException;
	// 		// return payload;
	// 		await this.usersService.turnOffTwoFa(payload.id);
	// 	} catch (e) {
	// 		throw new UnauthorizedException;
	// 	}
	// }

	// @Post('logout')
	// @UseGuards(JwtGuard)
	// async logout(@Res({passthrough: true}) response: Response)
	// {
	// 	response.clearCookie('my_cooky');
	// 	return {msg: 'cookies cleared?'}
	// }
}
