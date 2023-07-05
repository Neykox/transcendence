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
		console.log('client disconnected: ', client.id);
	}

	// @SubscribeMessage('message')
	// handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	// 	// this.server.emit('message', client.id, data);
	// 	console.log(data);
	// }

	@SubscribeMessage('updateGame')
	playerMove(@MessageBody() {p1, p2} , @ConnectedSocket() client: Socket) {
		// console.log("p1: ", p1, "p2: ", p2, "ball: ", ball)
		
		// p1.y += p1.dy * p1.dir;
		// p2.y += p2.dy * p2.dir;

		// p1.dir = 0;
		// p2.dir = 0;
		// this.server.to(p1.room).emit('playerMoved', {p1, p2});

		rooms[p1.room].p1 = p1;
		rooms[p1.room].p2 = p2;
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
			color: 'green',
			room: room,
			socketId: p1.id,
		};

		let paddle2: Paddle = {
			x: 1100,
			y: 100,
			dy: 10,
			dir: 0,
			w: 20,
			h: 300,
			score: 0,
			color: 'yellow',
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

		this.server.to(room).emit('matched', { "toile": toile, "paddle1": paddle1, "paddle2": paddle2, "ball": ball });
		this.game_loop(room, ball, toile);
		count++;
	}

	async game_loop(room: string, ball: Ball, canvas: Toile)//need to clean empty games (finished / dc'ed)
	{
		const p1 = rooms[room].p1;
		const p2 = rooms[room].p2;
		// console.log(rooms);
		// console.log("p1 = ", p1, " | p2 = ", p2)
		const interval = setInterval(() =>{
			// console.log('sup');
			// console.log("p1.socket = ", p1.socketId, " | p2.socket = ", p2.socketId)
			// ball.x = 500;
			// ball.y = 500;
			// ball.color = randomColor();
			const p1 = rooms[room].p1;
			const p2 = rooms[room].p2;

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

			//ball colliding with paddles, not feeling to good may need revision
			// if ((ball.x + ball.radius <= p1.x + p1.w && ball.x + ball.radius >= p1.x) && (ball.y + ball.radius <= p1.y + p1.h && ball.y + ball.radius >= p1.y)) {
			// 	ball.dx = -ball.dx;
			// }
			// if ((ball.x + ball.radius <= p2.x + p2.w && ball.x + ball.radius >= p2.x) && (ball.y + ball.radius <= p2.y + p2.h && ball.y + ball.radius >= p2.y)) {
			// 	ball.dx = -ball.dx;
			// }
			if (
				ball.x - ball.radius < p1.x + p1.w &&
				ball.x > p1.x &&
				ball.y < p1.y + p1.h &&
				ball.radius + ball.y > p1.y
			)
				ball.dx = -ball.dx;
			if (
				ball.x < p2.x + p2.w &&
				ball.x + ball.radius > p2.x &&
				ball.y < p2.y + p2.h &&
				ball.radius + ball.y > p2.y
			)
				ball.dx = -ball.dx;

			if (p1.score === 2 || p2.score === 2)
			{
				ball.dx = 0;
				ball.dy = 0;
				ball.color = 'black';
				// delete rooms[room];
				clearInterval(interval);
			}

			this.server.to(p1.room).emit('newFrame', {p1, p2, ball});
		}, 15);
	}

	// reset_ball()
	// {
	// 	let ball: Ball = {
	// 		// ball.x = canvas.width / 2;
	// 		// ball.y = canvas.height / 2;
	// 		ball.dx = 0//7 * (Math.floor(Math.random() * 2) ? 1 : -1);
	// 		ball.dy = 0//7 * (Math.floor(Math.random() * 2) ? 1 : -1);
	// 		// p1.score = 0;
	// 		// p2.score = 0;
	// 		ball.color = 'white';
	// 	}
	// }

	@SubscribeMessage('join_list')
	joinList(@ConnectedSocket() client: Socket) {
		// this.server.emit('message', client.id, data);
		console.log(client.id, "joined the list\n");
		players[client.id] = client;
		// console.log(players);
		// console.log("players length = ", Object.keys(players).length);

		if (Object.keys(players).length >= 2 && Object.keys(players).length % 2 == 0)
			this.make_room();
	}
} 