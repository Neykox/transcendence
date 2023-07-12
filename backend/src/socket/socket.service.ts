import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { PlayerDto } from '../dto/player.dto'


import { User, Room, Ball, Paddle, } from '../../shared/interfaces/game.interface'

const players: { name: string, color:string, gametype: string, socket: Socket}[] = [] ;
const rooms: Room[] = [];
let count = 0;
const ballSpeed = 1;
const max_score = 100;

let _1v1 = 0;
let _2balls = 0;

@WebSocketGateway({
		// transport: ['websocket'],
		cors: {
			origin: '*',
		},
		pingInterval: 2000,
		pingTimeout: 5000,
		// connectionStateRecovery: {
		// 	// the backup duration of the sessions and the packets
		// 	maxDisconnectionDuration: 2 * 60 * 1000,
		// 	// whether to skip middlewares upon successful recovery
		// 	skipMiddlewares: true,
		// },https://socket.io/docs/v4/connection-state-recovery
})

export class SocketService {

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket){
		console.log('client connected: ', client.id);
	}

	handleDisconnect(client: Socket){
		delete players[client.id];
		// console.log(rooms);
		for (const id in rooms)
		{
			if (rooms[id].p1.socketId === client.id)
				rooms[id].p1.dc = true;
			if (rooms[id].p2.socketId === client.id)
				rooms[id].p2.dc = true;
		}
		console.log(rooms);
		console.log('client disconnected: ', client.id);
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
	playerMove(@MessageBody() {p} , @ConnectedSocket() client: Socket) {
		if (p.socketId === rooms[p.room].p1.socketId)
			rooms[p.room].p1.dir = p.dir;
		else
			rooms[p.room].p2.dir = p.dir;
	}

	async make_room(gametype: string)
	{
		let p1: Socket = null;
		let p2: Socket = null;
		for (const id in players)
		{
			if (p1 === null && players[id].gametype === gametype)
				p1 = players[id].socket;
			else if (p2 === null && players[id].gametype === gametype)
				p2 = players[id].socket;
		}

		
		const room = count.toString();
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

		if (gametype === "1v1")
			_1v1 -= 2;
		else
			_2balls -= 2;

		let ball = {
			x: 500,
			y: 500,
			radius: 20,
			dx: ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1),
			dy: ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1),
			color: "white",
		}

		let ball2 = {
			x: 500,
			y: 500,
			radius: 20,
			dx: -ball.dx,
			dy: ballSpeed * (Math.floor(Math.random() * 2) ? 1 : -1),
			color: "white",
		}

		rooms[room] = {
			p1: paddle1,
			p2: paddle2
		}

		if (gametype === "1v1")
		{
			this.server.to(room).emit('matched', { "paddle1": paddle1, "paddle2": paddle2, "ball": ball, "max_score": max_score });
			this.game_loop(room, ball);
		}
		else
		{
			this.server.to(room).emit('2balls', { "paddle1": paddle1, "paddle2": paddle2, "ball": ball, "ball2": ball2, "max_score": max_score });
			this.game_loop_2ball(room, ball, ball2);
		}
		count++;
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
				delete rooms[room];
				console.log(rooms);
				clearInterval(interval);
			}

			this.server.to(room).emit('newFrame', {p1, p2, ball, ball2});
		}, 15);
	}

	@SubscribeMessage('join_list')
	joinList(@MessageBody() data, @ConnectedSocket() client: Socket) {
		players[client.id] = { name: data.pseudo, color: data.color, gametype: data.gametype, socket: client }
		// console.log(players)

		if (data.gametype === "1v1")
			_1v1++;
		else
			_2balls++;

		if (_1v1 >= 2 && _1v1 % 2 == 0)
			this.make_room("1v1");
		if (_2balls >= 2 && _2balls % 2 == 0)
			this.make_room("2balls");
	}
} 