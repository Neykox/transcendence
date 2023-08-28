import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ClassicDto } from '../dto/classic.dto'

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('create')
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(+id);
  }

  @Post('channel_by_name')
  findByName(@Body() {name}) {
    return this.channelsService.findByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.channelsService.remove(id);
  }

  // @Post('addUser')
  // async addUser(@Body() {channelId, newUser}) {
  //   return await this.channelsService.addUser(channelId, newUser);
  // }

  // @Post('removeUser')
  // async removeUser(@Body() {channelId, newUser}) {
  //   await this.channelsService.removeUser(channelId, newUser);
  // }

  @Post('getMembers')
  async getMembers(@Body() {channelId}: ClassicDto) {
    return await this.channelsService.getMembers({channelId: channelId});
  }

}
