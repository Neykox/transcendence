import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
			global: true,
			secret: 'secret'/*configService.get<string>('JWT_SECRET')*/,
			signOptions: {expiresIn: '60s' /*'10h'*/},
			}),
			inject: [ConfigService],
		}),
		ConfigModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
