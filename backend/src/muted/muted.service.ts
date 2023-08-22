import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Muted } from "./entities/muted.entity";
import { Repository } from "typeorm";
import { MutedDto } from "./dto/muted.dto";

@Injectable()
export class MutedService {
    constructor(
        @InjectRepository(Muted)
        private mutedRepository : Repository<Muted>
    ) {}

    async getOne(channel: number, user: number) {
        return this.mutedRepository.findOne({
            where: {
                channel,
                user
            }
        });
    }

    async getAll(channel:number, user:number) {
        return this.mutedRepository.find({
            where: {
                channel
            }
        });
    }

    async setMute(mutedDto: MutedDto) {
        // if (await this.getOne(mutedDto.channel, mutedDto.user) !== undefined) {
        //     return await this.update(mutedDto);
        // } else {
        //     const newMuted = await this.mutedRepository.createQueryBuilder()
        //         .insert()
        //         .values([
        //             {
        //                 channel: mutedDto.channel,
        //                 user: mutedDto.user,
        //                 until: mutedDto.until
        //             }
        //         ])
        //         .execute()
        //     return {
        //         message: 'User muted Successfully',
        //         user: mutedDto.user,
        //         channel: mutedDto.channel
        //     };
        // }
        const exist = await this.getOne(mutedDto.channel, mutedDto.user);
        if (exist === null)
            await this.mutedRepository.save(mutedDto);
    }

    async update(mutedDto: MutedDto) {
        try {
            const update = await this.mutedRepository.createQueryBuilder()
                .update()
                .set({ until: mutedDto.until })
                .where('user = :userId AND channel = :channelId', { userId: mutedDto.user, channelId: mutedDto.channel })
                .execute();
            return {
                message: 'Muted user successfully updated',
                user: mutedDto.user,
                channel: mutedDto.channel
            };
        }
        catch(error) {
            return {
                message: 'muted user update failed',
                user: mutedDto.user,
                channel: mutedDto.channel
            };
        }
    }

    async delete(channelId: number, userId: number) {
        // try {
        //     await this.mutedRepository.createQueryBuilder()
        //         .delete()
        //         .from(Muted)
        //         .where('user = :userId', { userId: mutedDto.user })
        //         .where('channel = :channelId', { channelId : mutedDto.channel })
        //         .execute();
        //     return {
        //         message: 'User successfully unmuted',
        //         user: mutedDto.user,
        //         channel: mutedDto.channel
        //     };
        // }
        // catch (error) {
        //     return {
        //         message: 'Fail to unmute user',
        //         user: mutedDto.user,
        //         channel: mutedDto.channel
        //     };
        // }
        const exist = await this.getOne(channelId, userId);
        if (exist !== null)
            await this.mutedRepository.delete(exist.id);
    }

    async isMute(channel: number, user: number) {
        // const mutedUser = await this.getOne(channel, user);
        // if (!mutedUser)
        //     return false;
        // const storedDate = new Date(mutedUser.until);
        const currentDate = new Date();
        console.log({currentDate})
        // if (storedDate.getTime() <= currentDate.getTime()) {
        //     await this.delete(channel, user);
        //     return false;
        // }
        // return true;
    }
}