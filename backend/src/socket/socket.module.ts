import { Module } from '@nestjs/common';
import { SocketService } from "./socket.service"
import { FriendGateway } from './friends.gateway';

@Module({
  providers: [SocketService, FriendGateway],
})
export class SocketModule {}

