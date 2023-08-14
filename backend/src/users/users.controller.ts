import { Controller, Get, Post, Param, Body, NotFoundException, ForbiddenException, UseGuards, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserCreationDto } from '../dto/user_creation.dto';
import { JwtGuard } from '../guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SocketService } from 'src/socket/socket.service';

interface profileResponse {
	id: number;
	login: string;
	username?: string;
	status: string;
	gamehistory: Array<{ id: number, opponent: string, scores: string, result: string }>;
}

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService, private readonly socketService: SocketService) {}

	@Get()
	findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@UseGuards(JwtGuard)
	@Get(':login')
	async findOneByLogin(@Param('login') login: string, @Req() request: Request): Promise<User> { 
		const user = await this.usersService.findOneByLogin(login);
		if (!user) {
			throw new NotFoundException('User does not exist!');
		} else if (request['user']['login'] != login) {
			throw new ForbiddenException('You are not allowed to access this user');
		}else {
			return user;
		}
	}

	@Get(':login/profile')
	async findOneProfile(@Param('login') login: string): Promise<profileResponse> { 
		const user = await this.usersService.findOneByLogin(login);
		if (!user) {
			throw new NotFoundException('User does not exist!');
		}
		console.log('test');
		return ({id: user.id, login: user.login, username: user.pseudo, gamehistory: user.gameHistory, status: await this.socketService.isConnected(user.login)})
	}

	@Post('create')
	async create(@Body() { Login, Image } : UserCreationDto)
	{
		return await this.usersService.create({"pseudo": Login, "login": Login, "image": Image})
	}

	@UseGuards(JwtGuard)
	@Put('changePseudo')
	async changeLogin(@Body() {Pseudo} : UserCreationDto, @Req() request: Request) {

		const user = await this.usersService.findOne(request.user['id']);
		await this.usersService.changePseudo(user, Pseudo);
		return Pseudo; 
	}

	@UseGuards(JwtGuard)
	@Put('changeAvatar')
	async changeAvatar(@Body() {Image} : UserCreationDto, @Req() request: Request) {
		const user = await this.usersService.findOne(request.user['id']);
		await this.usersService.changeAvatar(user, Image);
		return Image; 
	}

	@UseGuards(JwtGuard)
	@Post('history')
	async getHistory(@Req() request: Request) {

		const user = await this.usersService.findOne(request.user['id']);
		return (await this.usersService.getHistory(user.id));
	}

	@UseGuards(JwtGuard)
	@Post('addGameToHistory')
	async addGameToHistory(@Body() {score}, @Req() request: Request) {

		const user = await this.usersService.findOne(request.user['id']);
		await this.usersService.addGameToHistory(user.id, score);
	}
}
