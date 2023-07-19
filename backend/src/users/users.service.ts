import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
	constructor(
	@InjectRepository(User)
	private usersRepository: Repository<User>,
	private authService: AuthService
	) {}

	async findAll(): Promise<User[]> {
	return this.usersRepository.find();
	}

	findOne(id: number): Promise<User | null> {
	return this.usersRepository.findOneBy({ id });
	}

	async findOneByLogin(login: string): Promise<User> {
	return this.usersRepository.findOneBy({ login });
	}


	async setTwoFaSecret(secret: string, userId: number) {
	return this.usersRepository.update(userId, {
		twoFaSecret: secret
	});
	}

	async turnOnTwoFa(user: User) {
	this.usersRepository.update(user.id, { is2FaActive: true });
	// console.log({jwtSecret: await this.configService.get<string>('JWT_SECRET')})
	// console.log({host: await this.configService.get<string>('POSTGRES_HOST')})
	const token = await this.authService.create_cookie(user);
	return token
	}

	async turnOffTwoFa(user: User) {
	this.usersRepository.update(user.id, {
		is2FaActive: false,
		twoFaSecret: null,
	});
	}

	async create(user: Partial<User>): Promise<User>
	{
	const newuser = this.usersRepository.create(user);
	return this.usersRepository.save(newuser);
	}

	async changePseudo(user: User, newPseudo: string) {
	this.usersRepository.update(user.id, {pseudo: newPseudo, });
	}

	async changeAvatar(user: User, newAvatar: string) {
	this.usersRepository.update(user.id, {image: newAvatar, });
	}

	async getHistory(id: number) {
		const user = await this.usersRepository.findOneBy({id});
		console.log("history = ", user.gameHistory)
		return user.gameHistory;
	}

	async addGameToHistory(id: number, lastGame: any): Promise<void> {
		const user = await this.usersRepository.findOneBy({id});
		let index = 0;
		// const newHistory = [ ...user.gameHistory, ...lastGame ];
		let newHistory = user.gameHistory;
		console.log("newHistory = ", newHistory)

		// console.log("newHistory.game = ", newHistory.game)
		if (newHistory === null)
		{
			// newHistory = { id: 0, opponent: "test", scores: "test", result: "test" }
			newHistory[0] = lastGame;
			// newHistory.push(lastGame);
			this.usersRepository.update(id, { gameHistory: newHistory });
			return;
		}
		// for (index in newHistory.id)
		while (newHistory[index])
		{
			console.log("index = ", index, " | newHistory = ", newHistory);
			index++;
		}
		newHistory[index] = lastGame;//{ id: lastGame.id, opponent: lastGame.opponent, scores: lastGame.scores, result: lastGame.result }
		// newHistory[new Date(Date.now()).toLocaleString()] = lastGame;
		// newHistory.push(lastGame);
		console.log("at end newHistory = ", newHistory)
		// data = "|" + await JSON.stringify(user.gameHistory)
		this.usersRepository.update(id, { gameHistory: newHistory });
	}

	// async addGameToHistory(id: number, lastGame: JSON): Promise<void> {
	// 	const user = await this.usersRepository.findOneBy({id});
	// 	var data;
	// 	if (!user.gameHistory){
	// 		data = await JSON.stringify(lastGame);
	// 		this.usersRepository.update(id, { gameHistory: data });
	// 		return ;
	// 	}
	// 	user.gameHistory += "|" + await JSON.stringify(lastGame);
	// 	// const newHistory = [ ...user.gameHistory, ...lastGame ];
	// 	// const newHistory = user.gameHistory;
	// 	// newHistory[new Date(Date.now()).toLocaleString()] = lastGame;
	// 	// newHistory.push(lastGame);
	// 	console.log("newHistory = ", user.gameHistory)
	// 	// data = "|" + await JSON.stringify(user.gameHistory)
	// 	this.usersRepository.update(id, { gameHistory: user.gameHistory });
	// }

	// async addGameToHistory(id: number, lastGame: string): Promise<void> {
	// 	const user = await this.usersRepository.findOneBy({id});
	// 	// const newHistory = [ ...user.gameHistory, ...lastGame ];
	// 	const newHistory = user.gameHistory.split(',');
	// 	// newHistory[new Date(Date.now()).toLocaleString()] = lastGame;
	// 	newHistory.push(JSON.stringify(lastGame));
	// 	console.log("newHistory = ", newHistory)
	// 	this.usersRepository.update(id, { gameHistory: newHistory.join(',')});
	// }

	// async addFriend(id: number, lastGame: json): Promise<void> {
	// 	const user = await this.usersRepository.findOneBy({id});
	// 	const newFriends = user.friend_list.split(',');
	// 	newFriends.push(login);
	// 	this.usersRepository.update(id, { friend_list: newFriends.join(',') });
	// }

	// { id: number, opponent: string, scores: string, result: string }
}
