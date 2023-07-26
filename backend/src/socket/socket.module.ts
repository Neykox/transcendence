import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from "./socket.service"
import { FriendsModule } from 'src/friends/friends.module';

@Module({
	imports: [forwardRef(() => FriendsModule)],
  providers: [SocketService],
  exports: [SocketService]
})
export class SocketModule {}

