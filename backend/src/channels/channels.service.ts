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
      .select(['chan.id', 'chan.name', 'chan.owner', 'chan.type'])
      .getMany();
  }

  async findOne(id: number) {
    // must add if not found try/catch
    const chan = await this.channelRepository.findOneBy({
      id,
    });

    delete(chan.password);
    return chan;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    try {
      const chan = await this.channelRepository.findOneBy({
        id,
      });

      if (!chan) {
        throw new ForbiddenException(`Channel with id #${id} doesn't exist`); // good but should be 404 error instead of 403
      } else {
        const update = {
          ...chan, ...updateChannelDto,
        }
        if (update.type === 'protected') { // if type is protected (require a password)
          if (updateChannelDto.password) {
            update.password = await argon.hash(updateChannelDto.password);
          } else if (!updateChannelDto.password && !update.password) {
            update.password = await argon.hash(''); // channel is protected but no password given
          }
        } else {
          update.password = null;
        }
        return await this.channelRepository.save(update);
      }
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

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
