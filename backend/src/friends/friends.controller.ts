import { Controller, Get, Param, Post, Body, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { FriendRequest } from '../entities/friend_request.entity';
import { FriendsService } from './friends.service';
import { UsersService } from '../users/users.service';
import { JwtGuard } from '../guard/jwt.guard';
import { Request } from 'express';

interface FriendRequestResponse {
	id: number;
	sender: string;
	receiver: string;
	senderUsername: string;
}

interface UserResponse {
	id: number;
	login: string;
	username: string;
	status: string;
}

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService, private readonly usersService: UsersService) {}

	@UseGuards(JwtGuard)
	@Get()

	async fetchFriends(@Req() request: Request): Promise<UserResponse[]> {
		
		let user = request.user;
		if ( !user )
			return ; 
		const friends = (await this.usersService.fetchFriends(user['id'])).split(',');
		const response: UserResponse[] = [];

		for (const friend of friends) {
			const User = await this.usersService.findByLogin(friend);
			response.push({id: User.id, login: User.login, username: User.pseudo, status: await this.friendsService.isConnected(User.login)});
		}
		return response;
	}

	@UseGuards(JwtGuard)
	@Get('exists/:login')
	checkIfReqExists(@Param('login') login: string, @Req() request: Request): Promise<boolean> {
		
		let user = request.user;
		if ( !user )
			return; 
		return this.friendsService.checkIfReqExists(user['login'], login);
	}
	@UseGuards(JwtGuard)
	@Put('add')
	addFriend(@Body() body : FriendRequest, @Req() request: Request) {
		
		let user = request.user;
		if ( !user )
			return 'Error'; 
		return this.usersService.addFriend(user['id'], body['login']);
	}

	@UseGuards(JwtGuard)
	@Delete(':login')
	async deleteFriend(@Param('login') login: string, @Req() request: Request) {
		
		let user = request.user;
		if ( !user )
			return 'Error'; 
		this.usersService.removeFriend(user['id'], login);

		const oUser = await this.usersService.findOneByLogin(login);
		this.usersService.removeFriend(oUser.id, user['login']);
	}

	@UseGuards(JwtGuard)
	@Get('requests')
	async fetchRequests(@Req() request: Request): Promise<FriendRequestResponse[]> {
		
		let user = request.user;
		if ( !user )
			return;
		let requests = await this.friendsService.fetchRequests(user['login']);
		let requestsResponse : FriendRequestResponse[] = [];
		for (let r of requests) {
			let user = await this.usersService.findByLogin(r.sender);
			requestsResponse.push({id: r.id, sender: r.sender, receiver: r.receiver, senderUsername: user.pseudo})
		}
		return requestsResponse;
	}

	@UseGuards(JwtGuard)
	@Put('send/:login')
	sendRequest(@Param('login') login: string, @Req() request: Request) : Promise<string> {
		
		let user = request.user;
		console.log(user);
		if ( !user )
			return;
		return this.friendsService.sendRequest(user['login'], login);
	}

	@UseGuards(JwtGuard)
	@Delete('accept/:id')
	acceptRequest(@Param('id') id: number, @Req() request: Request) : Promise<string> {
		
		let user = request.user;
		if ( !user )
			return; 
		return this.friendsService.acceptRequest(id, user['login']);
	}

	@UseGuards(JwtGuard)
	@Delete('decline/:id')
	declineRequest(@Param('id') id: number, @Req() request: Request) : Promise<string>{
		
		let user = request.user;
		if ( !user )
			return; 
		return this.friendsService.declineRequest(id, user['login']);
	}
}
