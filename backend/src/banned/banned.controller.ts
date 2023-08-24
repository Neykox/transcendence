import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BannedService } from './banned.service';

@Controller('banned')
export class BannedController {
  constructor(private readonly bannedService: BannedService) {}

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.bannedService.getAll(+id);
  }

}
