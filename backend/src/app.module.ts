import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './two_fa/two_fa.module';

@Module({
    imports: [AuthModule, TwoFaModule],
})
export class AppModule {}