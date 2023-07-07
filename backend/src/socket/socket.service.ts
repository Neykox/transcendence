import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { PlayerDto } from '../dto/player.dto'


import { User, Room, Ball, Paddle, Toile, } from '../../shared/interfaces/game.interface'

const players: Socket[] = [];
const rooms: Room[] = [];
let count = 0;

const randomColor = (() => {
	  "use strict";

	  const randomInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	  };

	  return () => {
		var h = randomInt(0, 360);
		var s = randomInt(42, 98);
		var l = randomInt(40, 90);
		return `hsl(${h},${s}%,${l}%)`;
	  };
})();

@WebSocketGateway({
		transport: ['websocket'],
		cors: {
			origin: '*',
		},
		// cors: '*/*',
		// path: '/pong',
		pingInterval: 2000,
		pingTimeout: 5000,
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
		// for (const id in rooms)
		// {
		// 	if (rooms[id].p1.socketId === client.id)
		// 		delete rooms[id].p1;
		// 	if (rooms[id].p2.socketId === client.id)
		// 		delete rooms[id].p2;
		// }
		// console.log(rooms);
		console.log('client disconnected: ', client.id);
	}

	// @SubscribeMessage('message')
	// handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	// 	// this.server.emit('message', client.id, data);
	// 	console.log(data);
	// }

	@SubscribeMessage('updateGame')
	playerMove(@MessageBody() {p1, p2} , @ConnectedSocket() client: Socket) {
		if (p1.socketId === client.id)
			rooms[p1.room].p1.dir = p1.dir;
		else
			rooms[p1.room].p2.dir = p2.dir;
	}

	async make_room()
	{
		let p1: Socket = null;
		let p2: Socket = null;
		for (const id in players)
		{
			if (p1 === null)
				p1 = players[id];
			else if (p2 === null)
				p2 = players[id]
			else
				break;
		}

		
		const room = count.toString();
		p1.join(room);
		p2.join(room);
		delete players[p1.id];
		delete players[p2.id];

		let paddle1: Paddle = {
			x: 80,
			y: 100,
			dy: 10,
			dir: 0,
			w: 20,
			h: 300,
			score: 0,
			room: room,
			socketId: p1.id,
		};

		let paddle2: Paddle = {
			x: 1120,
			y: 100,
			dy: 10,
			dir: 0,
			w: 20,
			h: 300,
			score: 0,
			room: room,
			socketId: p2.id,
		};

		let ball = {
			x: 500,
			y: 500,
			radius: 20,
			dx: 7 * (Math.floor(Math.random() * 2) ? 1 : -1),
			dy: 7 * (Math.floor(Math.random() * 2) ? 1 : -1),
			color: "white",
			h: 10,
			w: 10,
		}

		let toile: Toile = {
			x: 1200,
			y: 800,
			oldx: 1200,
			oldy: 800,
			rx: 0,
			ry: 0,
		}

		rooms[room] = {
			p1: paddle1,
			p2: paddle2
		}

		const max_score = 5;

		this.server.to(room).emit('matched', { "toile": toile, "paddle1": paddle1, "paddle2": paddle2, "ball": ball, "max_score": max_score });
		this.game_loop(room, ball, toile, max_score);
		count++;
	}

	async game_loop(room: string, ball: Ball, canvas: Toile, max_score: number)//need to clean empty games (finished / dc'ed)
	{
		const p1 = rooms[room].p1;
		const p2 = rooms[room].p2;

		const interval = setInterval(() =>{

			//player movement
			p1.y += p1.dy * p1.dir;
			p2.y += p2.dy * p2.dir;

			p1.dir = 0;
			p2.dir = 0;


			//ball movement
			ball.x += ball.dx;
			ball.y += ball.dy;


			//old code when ball was a ball
			//ball colliding with wall
			if (ball.y + ball.radius > canvas.y || ball.y - ball.radius < 0) {
				ball.dy = -ball.dy;
			}

			//reset ball / increment score
			if (ball.x + ball.radius >= canvas.x) {
				ball.x = canvas.x / 2;
				ball.y = canvas.y / 2;
				ball.dx = -ball.dx;
				ball.dy = 7 * (Math.floor(Math.random() * 2) ? 1 : -1);
				p1.score += 1;
			}
			if (ball.x - ball.radius <= 0) {
				ball.x = canvas.x / 2;
				ball.y = canvas.y / 2;
				ball.dx = -ball.dx;
				ball.dy = 7 * (Math.floor(Math.random() * 2) ? 1 : -1);
				p2.score += 1;
			}


			//ball/paddle collision/bounce
			if (ball.x + ball.radius >= p1.x && ball.x - ball.radius <= p1.x + p1.w)
			{
				if (ball.y + ball.radius >= p1.y && ball.y - ball.radius <= p1.y + p1.h)
				{
					if (ball.x > p1.x + p1.w || ball.x < p1.x)
						ball.dx = -ball.dx;
					else
						ball.dy = -ball.dy;
				}
			}

			if (ball.x + ball.radius >= p2.x && ball.x - ball.radius <= p2.x + p2.w)
			{
				if (ball.y + ball.radius >= p2.y && ball.y - ball.radius <= p2.y + p2.h)
				{
					if (ball.x > p2.x + p2.w || ball.x < p2.x)
						ball.dx = -ball.dx;
					else
						ball.dy = -ball.dy;
				}
			}

			//stop game
			if (p1.score === max_score || p2.score === max_score)
			{
				ball.dx = 0;
				ball.dy = 0;
				ball.color = 'black';
				this.server.to(room).emit('newFrame', {p1, p2, ball});
				delete rooms[room];
				console.log(rooms);
				clearInterval(interval);
			}

			this.server.to(room).emit('newFrame', {p1, p2, ball});
		}, 60);
	}

	@SubscribeMessage('join_list')
	joinList(@ConnectedSocket() client: Socket) {
		players[client.id] = client;

		if (Object.keys(players).length >= 2 && Object.keys(players).length % 2 == 0)
			this.make_room();
	}
} 