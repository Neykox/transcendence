import { Module } from '@nestjs/common';
import { TwoFaController } from './two_fa.controller';
import { TwoFaService } from './two_fa.service';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [UsersModule],
	controllers: [TwoFaController],
	providers: [TwoFaService],
})
export class TwoFaModule {}
