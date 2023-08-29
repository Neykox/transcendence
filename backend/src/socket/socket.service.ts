import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { MatchmakingDto } from '../dto/matchmaking.dto'
import { PlayerMoveDto } from '../dto/playerMove.dto'
import { DuelDto } from '../dto/duel.dto'
import { ClassicDto } from '../dto/classic.dto'
import { PasswordDto } from '../dto/password.dto'
import { BannedService } from '../banned/banned.service';
import { MutedService } from '../muted/muted.service';
// import { MessageService } from '../message/message.service';
import { AdminService } from '../admin/admin.service';
import { ChannelsService } from '../channels/channels.service';
import { FriendsService } from "src/friends/friends.service";
import { Injectable, Inject, forwardRef } from '@nestjs/common'


import { User, Room, Ball, Paddle, } from '../../shared/interfaces/game.interface'

const players: { login: string, name: string, color:string, gametype: string, room: string, socket: Socket}[] = [] ;
const rooms: Room[] = [];
let count = 0;
const ballSpeed = 10;
const max_score = 3;

let _1v1 = 0;
let _2balls = 0;
var connected = {};

@WebSocketGateway({
		// transport: ['websocket'],
		cors: {
			origin: '*',
		},
		pingInterval: 2000,
		// connectionStateRecovery: {
		// 	// the backup duration of the sessions and the packets
		// 	maxDisconnectionDuration: 2 * 60 * 1000,
		// 	// whether to skip middlewares upon successful recovery
		// 	skipMiddlewares: true,
		// },https://socket.io/docs/v4/connection-state-recovery
})

@Injectable()
export class SocketService {

	constructor (
		private readonly bannedService: BannedService,
		private readonly mutedService: MutedService,
		// private readonly messageService: MessageService,
		private readonly adminService: AdminService,
		private readonly channelsService: ChannelsService,
		@Inject(forwardRef(() => FriendsService)) private readonly friendsService: FriendsService
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket){
		console.log('client connected: ', client.id);
	}

	handleDisconnect(client: Socket){
		if (players[client.id])
		{
			if (players[client.id].gametype === "1v1")
				_1v1--;
			else
				_2balls--;
		}
		delete players[client.id];
		// console.log(rooms);
		for (const id in rooms)
		{
			if (rooms[id].p1.socketId === client.id)
				rooms[id].p1.dc = true;
			if (rooms[id].p2.socketId === client.id)
				rooms[id].p2.dc = true;
		}

		for (const key in connected) {
			if (connected[key] == client)
			{
				delete connected[key];
				connected[key] = undefined;
				console.log(key, "disconnected !");
				break ;
			}
		}
		// console.log(rooms);
		// console.log('client disconnected: ', client.id);
	}

	// @SubscribeMessage('message')
	// handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	// 	// this.server.emit('message', client.id, data);
	// 	console.log(data);
	// }


	/*****************************************************************************/
										// 1 v 1
	/*****************************************************************************/
	@SubscribeMessage('updatePlayer')
	playerMove(@MessageBody() {socketId, dir, room} : PlayerMoveDto , @ConnectedSocket() client: Socket) {
		if (socketId === rooms[room].p1.socketId)
			rooms[room].p1.dir = dir;
		else
			rooms[room].p2.dir = dir;
	}

	async make_room(gametype: string, room: string)
	{
		let p1: Socket = null;
		let p2: Socket = null;

		if (room === null)
		{
			for (const id in players)
			{
				if (p1 === null && players[id].gametype === gametype && players[id].room === null)
					p1 = players[id].socket;
				else if (p2 === null && players[id].gametype === gametype && players[id].room === null)
					p2 = players[id].socket;
			}
			room = count.toString();
			count++;
			if (gametype === "1v1")
				_1v1 -= 2;
			else
				_2balls -= 2;
		}
		else
		{
			for (const id in players)
			{
				if (p1 === null && players[id].room === room)
					p1 = players[id].socket;
				else if (p2 === null && players[id].room === room)
					p2 = players[id].socket;
			}
		}
		console.log("room = ", room)

		p1.join(room);
		p2.join(room);

		let paddle1: Paddle = {
			x: 80,
			y: 250,
			dy: 10,
			dir: 0,
			w: 20,
			h: 300,
			score: 0,
			room: room,
			socketId: p1.id,
			name: players[p1.id].name,
			color: players[p1.id].color,
			dc: false,
		};

		let paddle2: Paddle = {
			x: 1120,
			y: 250,
			dy: 10,
			dir: 0,
			w: 20,
			h: 300,
			score: 0,
			room: room,
			socketId: p2.id,
			name: players[p2.id].name,
			color: players[p2.id].color,
			dc: false,
		};

		delete players[p1.id];
		delete players[p2.id];

		let ball = {
			x: 600,
			y: 600,
			radius: 20,
			dx: ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1),
			dy: ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1),
			color: "white",
		}

		let ball2 = {
			x: 600,
			y: 600,
			radius: 20,
			dx: -ball.dx,
			dy: ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1),
			color: "white",
		}

		rooms[room] = {
			p1: paddle1,
			p2: paddle2,
			// ball: ball,
			// ball2: ball2,
			// room: room,
			// gametype: gametype
		}

		if (gametype === "1v1")
		{
			this.server.to(room).emit('1v1', { "paddle1": paddle1, "paddle2": paddle2, "ball": ball, "max_score": max_score });
			this.game_loop(room, ball);
		}
		else
		{
			this.server.to(room).emit('2balls', { "paddle1": paddle1, "paddle2": paddle2, "ball": ball, "ball2": ball2, "max_score": max_score });
			this.game_loop_2ball(room, ball, ball2);
		}
	}

	async game_loop(room: string, ball: Ball)
	{
		const p1 = rooms[room].p1;
		const p2 = rooms[room].p2;
		const canvas = {x: 1200, y: 800};

		const interval = setInterval(() =>{

			if (p1.dc && p2.dc)
			{
				delete rooms[room];
				console.log(rooms);
				clearInterval(interval);
			}

			//player movement
			p1.y += p1.dy * p1.dir;
			p2.y += p2.dy * p2.dir;

			p1.dir = 0;
			p2.dir = 0;


			//ball movement
			ball.x += ball.dx;
			ball.y += ball.dy;


			//ball colliding with wall
			if (ball.y + ball.radius > canvas.y || ball.y - ball.radius < 0) {
				ball.dy = -ball.dy;
			}

			//reset ball / increment score
			if (ball.x + ball.radius >= canvas.x) {
				ball.x = canvas.x / 2;
				ball.y = canvas.y / 2;
				ball.dx = -ball.dx;
				ball.dy = ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1);
				p1.score += 1;
			}
			if (ball.x - ball.radius <= 0) {
				ball.x = canvas.x / 2;
				ball.y = canvas.y / 2;
				ball.dx = -ball.dx;
				ball.dy = ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1);
				p2.score += 1;
			}


			//ball/paddle collision/bounce
			if (ball.x + ball.radius >= p1.x && ball.x - ball.radius <= p1.x + p1.w)
			{
				if (ball.y + ball.radius >= p1.y && ball.y - ball.radius <= p1.y + p1.h)
				{
					if (ball.x > p1.x + p1.w || ball.x < p1.x)
						ball.dx = Math.abs(ball.dx);//need always +?
					else
						ball.dy = -ball.dy;
				}
			}

			if (ball.x + ball.radius >= p2.x && ball.x - ball.radius <= p2.x + p2.w)
			{
				if (ball.y + ball.radius >= p2.y && ball.y - ball.radius <= p2.y + p2.h)
				{
					if (ball.x > p2.x + p2.w || ball.x < p2.x)
						ball.dx = -Math.abs(ball.dx);//need always -?
					else
						ball.dy = -ball.dy;
				}
			}

			//stop game
			if (p1.score === max_score || p2.score === max_score)
			{
				ball.dx = 0;
				ball.dy = 0;
				p1.dc = true;
				p2.dc = true;
				this.server.to(room).emit('newFrame', {p1, p2, ball});
				this.server.to(room).emit('score', {p1, p2});
				delete rooms[room];
				console.log(rooms);
				clearInterval(interval);
			}

			this.server.to(room).emit('newFrame', {p1, p2, ball});
		}, 15);
	}

	async game_loop_2ball(room: string, ball: Ball, ball2: Ball)
	{
		const p1 = rooms[room].p1;
		const p2 = rooms[room].p2;
		const canvas = {x: 1200, y: 800};

		const interval = setInterval(() =>{

			if (p1.dc && p2.dc)
			{
				delete rooms[room];
				console.log(rooms);
				clearInterval(interval);
			}

			//player movement
			p1.y += p1.dy * p1.dir;
			p2.y += p2.dy * p2.dir;

			p1.dir = 0;
			p2.dir = 0;


			//ball movement
			ball.x += ball.dx;
			ball.y += ball.dy;


			//ball colliding with wall
			if (ball.y + ball.radius > canvas.y || ball.y - ball.radius < 0) {
				ball.dy = -ball.dy;
			}

			//reset ball / increment score
			if (ball.x + ball.radius >= canvas.x) {
				ball.x = canvas.x / 2;
				ball.y = canvas.y / 2;
				ball.dx = -ball.dx;
				ball.dy = ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1);
				p1.score += 1;
			}
			if (ball.x - ball.radius <= 0) {
				ball.x = canvas.x / 2;
				ball.y = canvas.y / 2;
				ball.dx = -ball.dx;
				ball.dy = ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1);
				p2.score += 1;
			}


			//ball/paddle collision/bounce
			if (ball.x + ball.radius >= p1.x && ball.x - ball.radius <= p1.x + p1.w)
			{
				if (ball.y + ball.radius >= p1.y && ball.y - ball.radius <= p1.y + p1.h)
				{
					if (ball.x > p1.x + p1.w || ball.x < p1.x)
						ball.dx = Math.abs(ball.dx);//need always +?
					else
						ball.dy = -ball.dy;
				}
			}

			if (ball.x + ball.radius >= p2.x && ball.x - ball.radius <= p2.x + p2.w)
			{
				if (ball.y + ball.radius >= p2.y && ball.y - ball.radius <= p2.y + p2.h)
				{
					if (ball.x > p2.x + p2.w || ball.x < p2.x)
						ball.dx = -Math.abs(ball.dx);//need always -?
					else
						ball.dy = -ball.dy;
				}
			}

			//ball2 movement
			ball2.x += ball2.dx;
			ball2.y += ball2.dy;


			//ball2 colliding with wall
			if (ball2.y + ball2.radius > canvas.y || ball2.y - ball2.radius < 0) {
				ball2.dy = -ball2.dy;
			}

			//reset ball2 / increment score
			if (ball2.x + ball2.radius >= canvas.x) {
				ball2.x = canvas.x / 2;
				ball2.y = canvas.y / 2;
				ball2.dx = -ball2.dx;
				ball2.dy = ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1);
				p1.score += 1;
			}
			if (ball2.x - ball2.radius <= 0) {
				ball2.x = canvas.x / 2;
				ball2.y = canvas.y / 2;
				ball2.dx = -ball2.dx;
				ball2.dy = ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1);
				p2.score += 1;
			}


			//ball2/paddle collision/bounce
			if (ball2.x + ball2.radius >= p1.x && ball2.x - ball2.radius <= p1.x + p1.w)
			{
				if (ball2.y + ball2.radius >= p1.y && ball2.y - ball2.radius <= p1.y + p1.h)
				{
					if (ball2.x > p1.x + p1.w || ball2.x < p1.x)
						ball2.dx = Math.abs(ball2.dx);//need always +?
					else
						ball2.dy = -ball2.dy;
				}
			}

			if (ball2.x + ball2.radius >= p2.x && ball2.x - ball2.radius <= p2.x + p2.w)
			{
				if (ball2.y + ball2.radius >= p2.y && ball2.y - ball2.radius <= p2.y + p2.h)
				{
					if (ball2.x > p2.x + p2.w || ball2.x < p2.x)
						ball2.dx = -Math.abs(ball2.dx);//need always -?
					else
						ball2.dy = -ball2.dy;
				}
			}

			//stop game
			if (p1.score === max_score || p2.score === max_score)
			{
				ball.dx = 0;
				ball.dy = 0;
				ball2.dx = 0;
				ball2.dy = 0;
				p1.dc = true;
				p2.dc = true;
				this.server.to(room).emit('newFrame', {p1, p2, ball, ball2});
				this.server.to(room).emit('score', {p1, p2});
				delete rooms[room];
				console.log(rooms);
				clearInterval(interval);
			}

			this.server.to(room).emit('newFrame', {p1, p2, ball, ball2});
		}, 15);
	}

	
	@SubscribeMessage('join_list')
	joinList(@MessageBody() data: MatchmakingDto, @ConnectedSocket() client: Socket) {

		for (const id in rooms)//desconnect someone if already in game
		{
			if (rooms[id].p1.socketId === client.id)
				rooms[id].p1.dc = true;
			if (rooms[id].p2.socketId === client.id)
				rooms[id].p2.dc = true;
		}


		// console.log("skip = ", skip)
		for (const id in players)//desconnect someone if already in game
		{
			if (players[id].login === data.login)
			{
				if (players[id].gametype === "1v1")
					_1v1--;
				else
					_2balls--;
				delete players[client.id];
			}
		}
		players[client.id] = { login: data.login, name: data.pseudo, color: data.color, gametype: data.gametype, room: null, socket: client }
		console.log(players)

		if (data.gametype === "1v1")
			_1v1++;
		else
			_2balls++;

		if (_1v1 >= 2 && _1v1 % 2 == 0)
			this.make_room("1v1", null);
		if (_2balls >= 2 && _2balls % 2 == 0)
			this.make_room("2balls", null);
	}

	@SubscribeMessage("private_match")
	private_match(@MessageBody() data: MatchmakingDto, @ConnectedSocket() client: Socket) {

		for (const id in rooms)
		{
			if (rooms[id].p1.socketId === client.id)
				rooms[id].p1.dc = true;
			if (rooms[id].p2.socketId === client.id)
				rooms[id].p2.dc = true;
		}
		// console.log("skip = ", skip)
		for (const id in players)//desconnect someone if already in game
		{
			if (players[id].login === data.login)
			{
				if (players[id].gametype === "1v1")
					_1v1--;
				else
					_2balls--;
				delete players[client.id];
			}
		}
		players[client.id] = { login: data.login, name: data.pseudo, color: data.color, gametype: data.gametype, room: data.room, socket: client }
		console.log(players)

		let num = 0;

		for (const id in players)
		{
			if (players[id].room === data.room)
				num++;
		}

		if (num === 2)
		{
			if (data.gametype === "1v1")
				this.make_room("1v1", data.room);
			else
				this.make_room("2balls", data.room);
		}
	}

	@SubscribeMessage("send_invite")
	send_invite(@MessageBody() {challenger, time, gametype, challenged}: DuelDto, @ConnectedSocket() client: Socket) {

				this.server.to(connected[challenged].id).emit("invite_received", { "challenger": challenger, "time": time, "gamemode": gametype});
	}
	
	@SubscribeMessage("send_answer")
	send_answer(@MessageBody() {challenger, time, answer, gametype} : DuelDto, @ConnectedSocket() client: Socket) {

				this.server.to(connected[challenger].id).emit("answer_received", { "answer": answer === true ? "accepted" : "declined", "challenger": challenger, "time": time, "gametype": gametype});
	}
	
	// TAG FRIEND LIST

	@SubscribeMessage('register')
	async handleRegister(@MessageBody() {login}, @ConnectedSocket() client: Socket) {
		console.log('received : ', login)
		if (!login)
			return('error');
		
		connected[login] = client;
		return ('OK');
	}
	
	@SubscribeMessage('sendFriend')
	async handleFriendSent(@MessageBody() data, @ConnectedSocket() client: Socket) {
		if (!data.to || !data.from)
		{
			client.emit('error', {text: "Something went wrong"});
			return ('error');
		}		
		let response = await this.friendsService.sendRequest(data.from, data.to);
		if (response != 'Request sent')
		{
			client.emit('error', {text: response});
			return (response);
		}
		let request = await this.friendsService.getRequest(data.to, data.from);
		if (connected[data.to] !== undefined)
			connected[data.to].emit('receiveFriend', {from: data.fromUsername, id: request.id});
		client.emit('success', {text: response + '!'})
		return 'OK'
	}

	@SubscribeMessage('testreq')
	async handleTest(@MessageBody() data, @ConnectedSocket() client: Socket) {
		client.emit('receiveFriend', {from: "royal"})
	}

	async isConnected(who: string) {
		if (connected[who] === undefined)
			return 'offline';
		return 'online';
	}






	/*****************************************************************************/

	@SubscribeMessage("joinChannel")
	async joinChannel(@MessageBody() {channelId, userId, userLogin}: ClassicDto, @ConnectedSocket() client: Socket) {
		console.log("join chqnne; ", channelId, userId, userLogin)
		if (await this.bannedService.isBan(channelId, userId) === false)
		{
			await this.channelsService.addUser({ channelId: channelId,  userId: userId, userLogin: userLogin });
			client.join(channelId.toString());
			this.server.to(channelId.toString()).emit("getMembers");
		}
	}

	@SubscribeMessage("leaveChannel")
	async leaveChannel(@MessageBody() {channelId, userId, userLogin}: ClassicDto, @ConnectedSocket() client: Socket) {
		await this.channelsService.removeUser({ channelId: channelId,  userId: userId, userLogin: userLogin });
		client.leave(channelId.toString());
		this.server.to(channelId.toString()).emit("getMembers");
	}

	/*****************************************************************************/

	@SubscribeMessage("send_dm_invite")
	async send_dm_invite(@MessageBody() {channel, user_login, target_login}, @ConnectedSocket() client: Socket) {
		// if (not blocked)
			if (!connected[target_login])
				return ;
			this.server.to(connected[target_login].id).emit("dm_invite", { "chan": channel, "user_login": user_login, "target_login": target_login });
		// this.server.to(client.id).emit("dm_invite", { "chan": channel, "user_login": user_login, "target_login": target_login });
	}

	/*****************************************************************************/

	@SubscribeMessage("send_message")
	async send_message(@MessageBody() {channelId, newMessage, userId}, @ConnectedSocket() client: Socket) {
		if (await this.mutedService.isMute(channelId, userId) === false)
			this.server.to(channelId.toString()).emit("newMessage", newMessage);
	}

	/*****************************************************************************/

	@SubscribeMessage("kick")
	async kick(@MessageBody() {channelId, userId, userLogin, targetId, targetLogin}: ClassicDto) {
		const user = {id: userId, login: userLogin};
		const target = {id: targetId, login: targetLogin};
		if (await this.isOp(channelId, user, target) === true)
			this.server.to(connected[target.login].id).emit("kicked", { "channelId": channelId });
	}

	/*****************************************************************************/

	@SubscribeMessage("ban")
	async ban(@MessageBody() {channelId, userId, userLogin, targetId, targetLogin}: ClassicDto) {
		const user = {id: userId, login: userLogin};
		const target = {id: targetId, login: targetLogin};
		if (await this.isOp(channelId, user, target) === true)
		{
			await this.bannedService.setBan({channel: channelId, userId: target.id, login: target.login});
			this.adminService.delete({channel: channelId, user: target.id});
			this.kick({channelId: channelId, userId: userId, userLogin: userLogin, targetId: targetId, targetLogin: targetLogin});
		}
	}

	@SubscribeMessage("unban")
	async unban(@MessageBody() {channelId, userId, userLogin, targetId, targetLogin}: ClassicDto) {
		const user = {id: userId, login: userLogin};
		const target = {id: targetId, login: targetLogin};
		if (await this.isOp(channelId, user, target) === true)
			await this.bannedService.delete({channel: channelId, userId: target.id, login: target.login});
	}

	/*****************************************************************************/

	@SubscribeMessage("mute")
	async mute(@MessageBody() {channelId, userId, userLogin, targetId, targetLogin}: ClassicDto) {
		const user = {id: userId, login: userLogin};
		const target = {id: targetId, login: targetLogin};
		if (await this.isOp(channelId, user, target) === true)
			await this.mutedService.setMute(channelId, target.id);
	}

	/*****************************************************************************/

	@SubscribeMessage("admin")
	async admin(@MessageBody() {channelId, userId, userLogin, targetId, targetLogin}: ClassicDto) {
		const user = {id: userId, login: userLogin};
		const target = {id: targetId, login: targetLogin};
		if (await this.isOp(channelId, user, target) === true)
			await this.adminService.setAdmin({channel: channelId, user: target.id});
	}

	@SubscribeMessage("unadmin")
	async unadmin(@MessageBody() {channelId, userId, userLogin, targetId, targetLogin}: ClassicDto) {
		const user = {id: userId, login: userLogin};
		const target = {id: targetId, login: targetLogin};
		if (await this.isOp(channelId, user, target) === true)
			this.adminService.delete({channel: channelId, user: target.id});
	}

	/*****************************************************************************/

	@SubscribeMessage("passwordCheck")
	async passwordCheck(@MessageBody() {id, password}: PasswordDto, @ConnectedSocket() client: Socket) {
		const ret = await this.channelsService.mdp_checker(id, password);
		this.server.to(client.id).emit("passwordChecked", {check: ret});
	}

	/*****************************************************************************/

	async isOp(channelId, user, target)
	{
		const chan = await this.channelsService.findOne(channelId);
		if (target.login === chan.owner)
		{
			console.log("target is owner | false");
			return false;
		}
		if (user.login === chan.owner)
		{
			console.log("user is owner | true");
			return true;
		}
		if (await this.adminService.isAdmin(channelId, user.id) === true && await this.adminService.isAdmin(channelId, target.id) === true)
		{
			console.log("both admin | false");
			return false;
		}
		if (await this.adminService.isAdmin(channelId, user.id) === false)
		{
			console.log("user not admin | false");
			return false;
		}
		console.log("else | true");
		return true;
	}
}
