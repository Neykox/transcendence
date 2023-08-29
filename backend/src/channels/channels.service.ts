import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { DatabaseError } from 'pg-protocol';
import { ClassicDto } from '../dto/classic.dto'

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    // create the new channel
    console.log({createChannelDto})
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
    if (createChannelDto.dm)
      channel.dm = createChannelDto.dm;

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

  async mdp_checker(id: number, mdp: string): Promise<boolean>
  {
    const chan = await this.channelRepository.findOneBy({ id });

    if (await argon.verify(chan.password, mdp))
      return true;
    return false;
  }

  async findAll(): Promise<Channel[]> {
    return await this.channelRepository
      .createQueryBuilder('chan')
      .select(['chan.id', 'chan.name', 'chan.owner', 'chan.type', 'chan.dm'])
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

  async findByName(name: string) {
    const chan = await this.channelRepository.findOneBy({
      name,
    });

    if (!chan) {
      throw new ForbiddenException(`Channel doesn't exist`);
    }

    delete(chan.password);
    return chan;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto, login: string) {
    try {
      const chan = await this.channelRepository.findOneBy({
        id,
      });
      if (!chan) {
        throw new ForbiddenException(`Channel with id #${id} doesn't exist`); // good but should be 404 error instead of 403
      } else {
		if (login !== chan.owner)
			return ;
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

  async addUser({channelId, userId, userLogin}: ClassicDto) {
    const newUser = {id: userId, login: userLogin}
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

  async removeUser({channelId, userId, userLogin}: ClassicDto) {
    const newUser = {id: userId, login: userLogin}
    const channel = await this.findOne(channelId);
    let index = 0;
    let n = 0;
    let users = channel.users;
    let newUsers = [];

    while (users[index])
    {
      if (users[index].id !== newUser.id)
        {
          newUsers[n] = users[index];
          n++;
        }
      index++;
    }
    this.channelRepository.update(channelId, { users: newUsers });
  }

  async getMembers({channelId}: ClassicDto) {
    const channel = await this.findOne(channelId);
    return channel.users;
  }
}
