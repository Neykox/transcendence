import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { BlockedController } from './blocked.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), UsersModule, JwtModule],
	controllers: [BlockedController],
})

export class BlockedModule {}
