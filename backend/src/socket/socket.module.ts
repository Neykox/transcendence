import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from "./socket.service"
import { FriendsModule } from 'src/friends/friends.module';
import { BannedModule } from '../banned/banned.module';
import { MutedModule } from '../muted/muted.module';

import { AdminModule } from '../admin/admin.module';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [BannedModule, MutedModule, AdminModule, ChannelsModule, forwardRef(() => FriendsModule)],
  providers: [SocketService],
  exports: [SocketService]
})
export class SocketModule {}

