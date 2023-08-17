import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Banned } from './entities/banned.entity';
import { BannedService } from './banned.service';

@Module({
  imports: [TypeOrmModule.forFeature([Banned])],
  providers: [BannedService],
  exports: [BannedService]
})
export class BannedModule {}
