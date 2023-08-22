import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Banned } from "./entities/banned.entity";
import { Repository } from "typeorm";
import { BannedDto } from "./dto/banned.dto";

@Injectable()
export class BannedService {
    constructor(
        @InjectRepository(Banned)
        private bannedRepository : Repository<Banned>
    ) {}

    async getOne(channel: number, user: number): Promise<Banned> {
        return this.bannedRepository.findOne({
            where: {
                channel,
                user
            }
        });
    }

    async getAll(channel: number): Promise<Banned[]> {
        return this.bannedRepository.find({
            where: {
                channel
            }
        });
    }

    async setBan(bannedDto: BannedDto) {
        // if (await this.getOne(bannedDto.channel, bannedDto.user) !== undefined)
        // {
        //     return {
        //         message: 'User already banned',
        //         user: bannedDto.user,
        //         channel: bannedDto.channel
        //     };
        // }
        // else {
            // const newBanned = await this.bannedRepository.createQueryBuilder()
            //     .insert()
            //     .values([
            //         {
            //             channel: bannedDto.channel,
            //             user: bannedDto.user
            //         }
            //     ])
            //     .execute();
        const exist = await this.getOne(bannedDto.channel, bannedDto.user);
        if (exist === null)
            await this.bannedRepository.save(bannedDto);
            // return {
            //     message: 'user successfully banned',
            //     user: bannedDto.user,
            //     channel: bannedDto.channel
            // };
        // }
    }

    async delete(bannedDto: BannedDto) {
        // try {
        //     await this.bannedRepository.createQueryBuilder()
        //         .delete()
        //         .from(Banned)
        //         .where('user = :userId', { userId: bannedDto.user })
        //         .where('channel = :channelId', { channelId : bannedDto.channel })
        //         .execute();
        //     return {
        //         message: 'User successfully unbanned',
        //         user: bannedDto.user,
        //         channel: bannedDto.channel
        //     };
        // }
        // catch (error) {
        //     return {
        //         message: 'Fail to unban user',
        //         user: bannedDto.user,
        //         channel: bannedDto.channel
        //     };
        // }
        const exist = await this.getOne(bannedDto.channel, bannedDto.user);
        if (exist !== null)
            await this.bannedRepository.delete(exist.id);
    }

    async isBan(channel: number, user: number) {
        const banUser = await this.getOne(channel, user);
        if (!banUser)
            return false;
        return true;
    }
}