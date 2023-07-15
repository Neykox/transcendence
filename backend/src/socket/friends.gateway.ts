import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketServer,
	WsResponse,
	WebSocketGateway
} from '@nestjs/websockets';

import {Server, Socket } from 'socket.io'

var connected: Socket [];

export class FriendGateway {
	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket){
	}

	handleDisconnect(client: Socket){
	}

	// @SubscribeMessage('register')
	// handleregister(@MessageBody() data: string, @ConnectedSocket() client: Socket) : string {
	// 	if (!data['login'])
	// 		return 'KO'
		
	// 	connected[data['login']] = client;
	// 	return 'OK';
	// }

	// @SubscribeMessage('test')
	// handleTest(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	// 	if (!data['to'] || !connected[data['to']])
	// 		return 'KO'
	// 	connected[data['to']].emit('you got mail !');
	// 	return 'OK'
	// }
}
