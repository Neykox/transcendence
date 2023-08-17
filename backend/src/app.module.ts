import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './two_fa/two_fa.module';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

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
				entities: [User],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		TypeOrmModule.forFeature([User]),
		UsersModule,
		AuthModule,
		TwoFaModule],
	// controllers: [AppController],
	// providers: [AppService],
})
export class AppModule {}
