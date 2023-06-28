import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { PlayerDto } from '../dto/player.dto'


import { User, Room, Ball, Paddle } from '../../shared/interfaces/game.interface'

const players: Socket[] = [];
let count = 0;

@WebSocketGateway({
	cors: {
		origin: '*',
		},
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

	@SubscribeMessage('message')
	handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
		// this.server.emit('message', client.id, data);
		console.log(data);
	}

	@SubscribeMessage('updatePlayers')
	playerMove(@MessageBody() player, @ConnectedSocket() client: Socket) {
		// this.server.emit('message', client.id, data);
		// console.log(player);
		player.p1.y += player.p1.dy * player.p1.dir;
		player.p2.y += player.p2.dy * player.p2.dir;
		// client.to(player.room).emit('playerMoved', player);
		this.server.to(player.p1.room).emit('playerMoved', player);
		// this.server.to(player.room).emit('yourData', player.p1)
		// this.server.to(player.room).emit('enemyData', player.p2)
	}

	make_room()
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
		// p1.room = room;
		// p2.room = room;
		p1.join(room);
		p2.join(room);
		// console.log("p1 = ", p1);
		// console.log("p2 = ", p2);
		// console.log("players before delete = ", players);
		delete players[p1.id];
		delete players[p2.id];
		// console.log("players after delete = ", players);
		let paddle1: Paddle = {
			x: 100,
			y: 100,
			dy: 10,
			dir: 0,
			w: 100,
			h: 100,
			score: 0,
			color: 'green',
			room: room,
			socketId: p1.id,
		};

		let paddle2: Paddle = {
			x: 300,
			y: 200,
			dy: 10,
			dir: 0,
			w: 100,
			h: 100,
			score: 0,
			color: 'yellow',
			room: room,
			socketId: p2.id,
		};

		this.server.to(room).emit('matched', { "paddle1": paddle1, "paddle2": paddle2 });
		// p1.to(room).emit("matched", { "paddle1": paddle1, "paddle2": paddle2 });
		// p2.to(room).emit("matched", { "paddle1": paddle2, "paddle2": paddle1 });

		// p1.to(room).emit("playedMoved", { "paddle1": paddle1, "paddle2": paddle2 })
		// p2.to(room).emit("playedMoved", { "paddle1": paddle2, "paddle2": paddle1 })
		count++;
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
		console.log(client.id, "joined the list");
		players[client.id] = client;
		// console.log(players);
		// console.log("players length = ", Object.keys(players).length);

		if (Object.keys(players).length >= 2 && Object.keys(players).length % 2 == 0)
			this.make_room();
	}
} 