import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { ChannelsModule } from './channels/channels.module';
import { Channel } from './channels/entities/channel.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'db_postgres',
            port: 5432,
            username: 'utilisateur',
            password: 'motdepasse',
            database: 'basededonnee',
            entities: [User, Channel],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
        ChannelsModule,
    ],
    controllers: [AppController, UsersController],
    providers: [AppService, UsersService],
})
export class AppModule {}