import { Controller, Get, Param, Post, Body, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { FriendRequest } from '../entities/friend_request.entity';
import { FriendsService } from './friends.service';
import { UsersService } from '../users/users.service';
import { JwtGuard } from '../guard/jwt.guard';
import { Request } from 'express';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService, private readonly usersService: UsersService) {}

	@UseGuards(JwtGuard)
	@Get()
	fetchFriends(@Req() request: Request): Promise<string> {
		
		let user = request['user'];
		if ( !user )
			return ; 
		return this.usersService.fetchFriends(user['id']);
	}

	@UseGuards(JwtGuard)
	@Get('exists/:login')
	checkIfReqExists(@Param('login') login: string, @Req() request: Request): Promise<boolean> {
		
		let user = request['user'];
		if ( !user )
			return; 
		return this.friendsService.checkIfReqExists(user['login'], login);
	}
	@UseGuards(JwtGuard)
	@Put('add')
	addFriend(@Body() body : FriendRequest, @Req() request: Request) {
		
		let user = request['user'];
		if ( !user )
			return 'Error'; 
		return this.usersService.addFriend(user['id'], body['login']);
	}

	@UseGuards(JwtGuard)
	@Delete('delete')
	deleteFriend(@Body() body : FriendRequest, @Req() request: Request) {
		
		let user = request['user'];
		if ( !user )
			return 'Error'; 
		return this.usersService.removeFriend(user['id'], body['login']);
	}

	@UseGuards(JwtGuard)
	@Get('requests')
	fetchRequests(@Req() request: Request): Promise<FriendRequest[]> {
		
		let user = request['user'];
		if ( !user )
			return; 
		return this.friendsService.fetchRequests(user['login']);
	}

	@UseGuards(JwtGuard)
	@Put('send/:login')
	sendRequest(@Param('login') login: string, @Req() request: Request) : Promise<string> {
		
		let user = request['user'];
		if ( !user )
			return; 
		return this.friendsService.sendRequest(user['login'], login);
	}

	@UseGuards(JwtGuard)
	@Delete('accept/:id')
	acceptRequest(@Param('id') id: number, @Req() request: Request) : Promise<string> {
		
		let user = request.user['login'];
		if ( !user )
			return; 
		console.log(user);
		return this.friendsService.acceptRequest(id, user);
	}

	@UseGuards(JwtGuard)
	@Delete('decline/:id')
	declineRequest(@Param('id') id: number, @Req() request: Request) : Promise<string>{
		
		let user = request['user'];
		if ( !user )
			return; 
		return this.friendsService.declineRequest(id, user['id']);
	}
}
