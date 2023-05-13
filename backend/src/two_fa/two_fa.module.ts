import { Module } from '@nestjs/common';
import { TwoFaController } from './two_fa.controller';
import { TwoFaService } from './two_fa.service';

@Module({
	controllers: [TwoFaController],
	providers: [TwoFaService],
})
export class TwoFaModule {}
