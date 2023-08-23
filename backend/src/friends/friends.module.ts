import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from 'src/entities/friend_request.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { SocketModule } from 'src/socket/socket.module';
import { forwardRef } from '@nestjs/common'

@Module({
imports: [TypeOrmModule.forFeature([FriendRequest]), JwtModule, UsersModule, forwardRef(() => SocketModule)],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
