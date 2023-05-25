import { Module } from '@nestjs/common';
import { TwoFaController } from './two_fa.controller';
import { TwoFaService } from './two_fa.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [UsersModule, JwtModule],
	controllers: [TwoFaController],
	providers: [TwoFaService],
})
export class TwoFaModule {}
