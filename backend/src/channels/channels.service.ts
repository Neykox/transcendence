import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { QueryFailedError, Repository } from 'typeorm';
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
    const chan = await this.channelRepository.findOneBy({
      id,
    });

    if (!chan) {
      throw new ForbiddenException(`Channel with id #${id} doesn't exist`);
    }

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
    return this.channelRepository.delete(id);
  }

  async addUser(channelId: number, newUser: any) {
    const channel = await this.findOne(channelId);
    let index = 0;
    let newUsers = channel.users;

    if (newUsers === null)
    {
      newUsers[0] = newUser;
      this.channelRepository.update(channelId, { users: newUsers });
      return;
    }
    while (newUsers[index])
    {
      if (newUsers[index].id === newUser.id)
        return {msg: "already in channel"};
      index++;
    }
    newUsers[index] = newUser;
    this.channelRepository.update(channelId, { users: newUsers });
    return {msg: "user added"};
  }

  async removeUser(channelId: number, newUser: any) {
    const channel = await this.findOne(channelId);
    let index = 0;
    let newUsers = channel.users;

    while (newUsers[index])
    {
      if (newUsers[index].id === newUser.id)
        delete(newUsers[index]);
      index++;
    }
    this.channelRepository.update(channelId, { users: newUsers });
  }
}
