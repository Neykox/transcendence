import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    // create the new channel
    const channel = new Channel();
    channel.owner = createChannelDto.owner;
    channel.name = createChannelDto.name;
    channel.type = createChannelDto.type;
    if (createChannelDto.type === 'protected') {
      const hash = await argon.hash(createChannelDto.password);
      channel.password = hash;
    }

    // save the channel in the database
    try {
      const createdChannel = await this.channelRepository.save(channel);
  
      delete(createdChannel.password);

      return (createdChannel);
    }
    catch(error) {
      if (error instanceof QueryFailedError) {
       console.log('ceci est un test'); //HERE codes d'erreur
      }
      else {
        console.log('test');
      }
    }
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
