import { Module } from '@nestjs/common';
import { SocketService } from "./socket.service"
import { FriendsModule } from 'src/friends/friends.module';

@Module({
	imports: [FriendsModule],
  providers: [SocketService],
})
export class SocketModule {}

