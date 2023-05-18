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
import { Response } from 'express';
import { TwoFaService } from './two_fa.service';
import { UsersService } from '../users/users.service';
import { TwoFaCodeDto } from '../dto/two_fa_code.dto'

@Controller('two_fa')
export class TwoFaController {
	constructor(private twoFaService: TwoFaService, private readonly usersService: UsersService) {}

	@Get('generate_qrcode')
	// @UseGuards(JwtAuthenticationGuard)
	// async register(@Res() response: Response, @Req() request: RequestWithUser) {
	async register() {
		const  otpauthUrl  = await this.twoFaService.generate_2Fa_Secret(await this.usersService.findOne(1));

		// console.log(otpauthUrl);
		return otpauthUrl;
		// return this.twoFaService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post('turn-on')
	@HttpCode(200)
	// @UseGuards(JwtAuthenticationGuard)
	async turnOnTwoFactorAuthentication(@Body() { TwoFaCode } : TwoFaCodeDto)
	{
		console.log({TwoFaCode});
		const isCodeValid = this.twoFaService.isTwoFactorAuthenticationCodeValid(TwoFaCode, await this.usersService.findOne(1));
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		await this.usersService.turnOnTwoFa((await this.usersService.findOne(1)).id);
	}

	@Post('turn-off')
	@HttpCode(200)
	// @UseGuards(JwtAuthenticationGuard)
	async turnOffTwoFactorAuthentication()
	{
		await this.usersService.turnOffTwoFa((await this.usersService.findOne(1)).id);
	}
}
