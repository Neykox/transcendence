import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './two_fa/two_fa.module';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { ChannelsModule } from './channels/channels.module';
import { Channel } from './channels/entities/channel.entity';
import { Banned } from './banned/entities/banned.entity';
import { Muted } from './muted/entities/muted.entity';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

import { SocketModule } from './socket/socket.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '../../.env',
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			// imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				type: 'postgres',
				host: config.get('POSTGRES_HOST'),
				port: config.get('POSTGRES_PORT'),
				username: config.get('POSTGRES_USER'),
				password: config.get('POSTGRES_PASSWORD'),
				database: config.get('POSTGRES_DB'),
				entities: [User, Channel, Banned, Muted],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		TypeOrmModule.forFeature([User]),
		UsersModule,
		AuthModule,
		TwoFaModule,
		SocketModule,
		ChannelsModule,],
	// controllers: [AppController],
	// providers: [AppService],
})
export class AppModule {}
