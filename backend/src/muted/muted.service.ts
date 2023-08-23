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

    async setMute(channelId: number, userId: number) {
        function addMinutes(date, minutes) {
            const dateCopy = new Date(date);
            dateCopy.setMinutes(date.getMinutes() + minutes);

            return dateCopy;
        }
        const date = new Date();
        const newDate = addMinutes(date, 2).toString();
        console.log(newDate)

        const exist = await this.getOne(channelId, userId);
        if (exist === null)
            await this.mutedRepository.save({channel: channelId, user: userId, until: newDate});
    }

    // async update(mutedDto: MutedDto) {
    //     try {
    //         const update = await this.mutedRepository.createQueryBuilder()
    //             .update()
    //             .set({ until: newDate })
    //             .where('user = :userId AND channel = :channelId', { userId: mutedDto.user, channelId: mutedDto.channel })
    //             .execute();
    //         return {
    //             message: 'Muted user successfully updated',
    //             user: mutedDto.user,
    //             channel: mutedDto.channel
    //         };
    //     }
    //     catch(error) {
    //         return {
    //             message: 'muted user update failed',
    //             user: mutedDto.user,
    //             channel: mutedDto.channel
    //         };
    //     }
    // }

    async delete(channelId: number, userId: number) {
        const exist = await this.getOne(channelId, userId);
        if (exist !== null)
            await this.mutedRepository.delete(exist.id);
    }

    async isMute(channel: number, user: number) {
        const mutedUser = await this.getOne(channel, user);
        if (!mutedUser)
            return false;
        const currentDate = new Date().toString();
        if (mutedUser.until <= currentDate) {
            await this.delete(channel, user);
            return false;
        }
        return true;
    }
}