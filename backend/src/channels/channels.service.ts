import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';
import { DatabaseError } from 'pg-protocol';

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
      if (createChannelDto.password) {
        channel.password = await argon.hash(createChannelDto.password);
      } else {
        channel.password = await argon.hash(''); // channel is protected but no password given
      }
    }

    // save the channel in the database
    try {
      const createdChannel = await this.channelRepository.save(channel);
  
      delete(createdChannel.password);

      return (createdChannel);
    }
    catch(error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError as DatabaseError;

        // channel name already taken
        if (err.code === '23505') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<Channel[]> {
    return await this.channelRepository
      .createQueryBuilder('chan')
      .select(['chan.name', 'chan.owner', 'chan.type'])
      .getMany(); //HERE
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
