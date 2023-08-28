import { Controller, UseGuards, HttpCode } from '@nestjs/common';
import { Get, Post, Delete, Body, Req } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { BlockDto } from '../dto/block.dto';

@Controller('blocked')
export class BlockedController {
	constructor(private readonly userService: UsersService) {}

	@Get()
	@UseGuards(JwtGuard)
	async getall( @Req() request: Request) : Promise<string[]> {
		return (await this.userService.getBlocked(request.user['login'])).split(',');
	}

	@Post()
	@UseGuards(JwtGuard)
	async block(@Body() {login}: BlockDto, @Req() request: Request) : Promise<string> {
		if ( !login ) {
			throw new Error("No login provided");
		}
		this.userService.blockUser(request.user['login'], login);
		return "Success"
	}

	@Delete()
	@UseGuards(JwtGuard)
	async unblock(@Body() {login}: BlockDto, @Req() request: Request) : Promise<string> {
		if ( !login ) {
			throw new Error("No login provided");
		}
		this.userService.unblockUser(request.user['login'], login);
		return "Success"
	}

}
