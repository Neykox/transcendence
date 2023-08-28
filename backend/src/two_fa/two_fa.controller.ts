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
import { JwtGuard } from '../guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('two_fa')
export class TwoFaController {
	constructor(private twoFaService: TwoFaService, private usersService: UsersService, private jwtService: JwtService) {}

	@Get('generate_qrcode')
	@UseGuards(JwtGuard)
	async register(@Req() request: Request) {
		const  otpauthUrl  = await this.twoFaService.generate_2Fa_Secret(await this.usersService.findOne(request.user['id']));

		return otpauthUrl;
	}

	@Post('turn-on')
	@HttpCode(200)
	async turnOnTwoFactorAuthentication(@Body() { TwoFaCode, Id } : TwoFaCodeDto, @Res({passthrough: true}) response: Response, @Req() request: Request)
	{
		const user = await this.usersService.findOne(Id);
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

		const user = await this.usersService.findOne(request.user['id']);
		await this.usersService.turnOffTwoFa(user);
		return {msg: "turned oof"}
	}
}
