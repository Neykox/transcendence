import { Controller, Get, Post, Param, Body, NotFoundException, UseGuards, Put, Req, HttpStatus,
	HttpException} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserCreationDto } from '../dto/user_creation.dto';
import { JwtGuard } from '../guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';



@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(':login')
	async findOneByLogin(@Param('login') login: string): Promise<User> { 
		const user = await this.usersService.findOneByLogin(login);
		if (!user) {
			throw new NotFoundException('User does not exist!');
		} else {
			return user;
		}
	}

	@Post('create')
	async create(@Body() { Login, Image } : UserCreationDto)
	{
		return await this.usersService.create({"pseudo": Login, "login": Login, "image": Image})
	}

	@UseGuards(JwtGuard)
	@Put('changePseudo')
	async changeLogin(@Body() {Pseudo} : UserCreationDto, @Req() request: Request) {
		if (request['error'])
			throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED);

		const user = await this.usersService.findOne(request.user['id']);
		await this.usersService.changePseudo(user, Pseudo);
		return Pseudo; 
	  }

	  @UseGuards(JwtGuard)
	  @Put('changeAvatar')
	  async changeAvatar(@Body() {Image} : UserCreationDto, @Req() request: Request) {
		if (request['error'])
			throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED)

		  const user = await this.usersService.findOne(request.user['id']);
		  await this.usersService.changeAvatar(user, Image);
		  return Image; 
		}
}
