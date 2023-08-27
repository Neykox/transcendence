import { Module } from '@nestjs/common';
import { SocketService } from "./socket.service";
import { BannedModule } from '../banned/banned.module';
import { MutedModule } from '../muted/muted.module';
// import { MessageModule } from '../message/message.module';

import { AdminModule } from '../admin/admin.module';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [BannedModule, MutedModule, AdminModule, ChannelsModule, ],
  providers: [SocketService],
})
export class SocketModule {}

