import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserCreationDto } from '../dto/user_creation.dto';

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

// 	@Get(':id')
  // async findOne(@Param('id') id: number): Promise<User> {
  //   const user = await this.usersService.findOne(id);
  //   if (!user) {
  //     throw new NotFoundException('User does not exist!');
  //   } else {
  //     return user;
  //   }
  // }

	@Post('create')
	async create(@Body() { Login, Image } : UserCreationDto)
	{
		return await this.usersService.create({"pseudo": Login, "login": Login, "image": Image})
	}

	// @Post('create')
	// async create(@Body() user: User)
	// {
	// 	console.log("create user = ",user);
	// 	return await this.usersService.create({"pseudo": user.login, "login": user.login, "image": user.image})
	// }

	// @Post()
	// async create(@Body() user: User): Promise<User>
	// {
	// 	return this.usersService.create(user);
	// }
}
