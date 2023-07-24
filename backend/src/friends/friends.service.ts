import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from 'src/entities/friend_request.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class FriendsService {
	constructor(
		@InjectRepository(FriendRequest)
		private friendRequestRepository: Repository<FriendRequest>,
		private readonly usersService: UsersService
	) {}

	async fetchRequests(login: string): Promise<FriendRequest[]> {
		return this.friendRequestRepository.find({ where: { receiver: login } });
	}

	async acceptRequest(id: number, login: string): Promise<string> {
		const request = await this.friendRequestRepository.findOne({ where: { id: id } });
		if (request.receiver === login) {
			let User = await this.usersService.findByLogin(request.sender);
			await this.usersService.addFriend(User.id, request.receiver);
			User = await this.usersService.findByLogin(request.receiver);
			await this.usersService.addFriend(User.id, request.sender);
			
			await this.friendRequestRepository.delete(id);
			return 'Request accepted';
		}
		return 'Error';
	}

	async declineRequest(id: number, login: string): Promise<string> {
		const request = await this.friendRequestRepository.findOneBy({id});
		if (request.receiver === login) {
			await this.friendRequestRepository.delete(id);
			return 'Request declined';
		}
		return 'Error';
	}

	async checkIfReqExists(sender: string, receiver: string): Promise<boolean> {
		const request = await this.friendRequestRepository.findOne({ where: { sender: sender, receiver: receiver } });
		if (request) {
			return true;
		}
		return false;
	}

	async sendRequest(sender: string, receiver: string): Promise<string> {
		if (sender === receiver) {
			return 'You cannot send request to yourself';
		}
		if (await this.checkIfReqExists(sender, receiver)) {
			return 'Request already exists';
		}
		const user = await this.usersService.findByLogin(sender);
		const friend_list = user.friend_list.split(',');
		if (friend_list.findIndex(friend => friend === receiver) === -1)
			return 'You are already friend with this person !';
		console.log(sender, receiver);
		const request = new FriendRequest();
		request.sender = sender;
		request.receiver = receiver;
		await this.friendRequestRepository.save(request);
		return 'Request sent';
	}

	async getRequest(to: string, from: string): Promise<FriendRequest> {
	return this.friendRequestRepository.findOne({ where: { receiver: to, sender: from } });
	}
}
