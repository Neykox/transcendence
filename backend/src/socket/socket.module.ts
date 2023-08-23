import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from "./socket.service"
import { FriendsModule } from 'src/friends/friends.module';
import { BannedModule } from '../banned/banned.module';
import { MutedModule } from '../muted/muted.module';
import { MessageModule } from '../message/message.module';

import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [BannedModule, MutedModule, MessageModule, ChannelsModule, forwardRef(() => FriendsModule)],
  providers: [SocketService],
  exports: [SocketService]
})
export class SocketModule {}

