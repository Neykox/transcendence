import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { PlayerDto } from '../dto/player.dto'


import { User, Room } from '../interfaces/game.interface'

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
} 