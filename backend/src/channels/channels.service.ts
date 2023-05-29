import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    ) {}

  async create(createChannelDto: CreateChannelDto) {
    // check if channel is protected which means we should encrypt the password
    if (createChannelDto.type === 'protected') {
      const hash = argon.hash(createChannelDto.password);
    }

    // save the channel in the database
    const channel = new Channel();
    channel.owner = // HERE

    // return the saved channel (only the dto atm)
    return createChannelDto;
  }

  findAll() {
    return `This action returns all channels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
