import { Module } from '@nestjs/common';
import { SocketService } from "./socket.service"
import { FriendGateway } from './friends.gateway';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
	imports: [FriendsModule],
  providers: [SocketService, FriendGateway],
})
export class SocketModule {}

