import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Banned } from './entities/banned.entity';
import { BannedService } from './banned.service';
import { BannedController } from './banned.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Banned])],
  providers: [BannedService],
  controllers: [BannedController],
  exports: [BannedService]
})
export class BannedModule {}
