import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { PlayerDto } from '../dto/player.dto'


import { User, Room } from '../../shared/interfaces/game.interface'

const players: Socket[] = [];

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
		console.log('client disconnected: ', client.id);
	}

	@SubscribeMessage('message')
	handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
		// this.server.emit('message', client.id, data);
		console.log(data);
	}

	@SubscribeMessage('updatePlayers')
	playerMove(@MessageBody() player: PlayerDto, @ConnectedSocket() client: Socket) {
		// this.server.emit('message', client.id, data);
		// console.log(player);
		player.y += player.dy * player.dir;
		client.emit('playerMoved', player);
		// this.server.to(player.room).emit('playerMoved', player)
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
		// const room = "";
		// p1.room = room;
		// p2.room = room;
		// p1.join(room);
		// p2.join(room);
		// console.log("p1 = ", p1);
		// console.log("p2 = ", p2);
		// console.log("players before delete = ", players);
		delete players[p1.id];
		delete players[p2.id];
		// console.log("players after delete = ", players);
		p1.emit("matched", {
			x: 100,
			y: 100,
			dy: 10,
			w: 100,
			h: 100,
			score: 0,
			color: 'green',
		});
		// p2.emit("playedMoved", {
		// 	x: 200,
		// 	y: 200,
		// 	dy: 10,
		// 	w: 200,
		// 	h: 200,
		// 	score: 0,
		// 	color: 'yellow',
		// })
	}

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