import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { MessageDto } from "./dto/message.dto";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>
    ) {}

    async getOne(channel:number, messId: number): Promise<Message> {
        return this.messageRepository.createQueryBuilder()
            .where('channel = :channelId AND id = :messageId', { channelId: channel, messageId: messId })
            .getOne();
    }

    async getAll(channel: number): Promise<Message[]> { //should be updated for future relations
        return this.messageRepository.createQueryBuilder()
            .where('channel = :channelId', { channelId: channel })
            .getMany();
    }

    async create(messageDto: MessageDto) {
        try {
            const newMess = await this.messageRepository.createQueryBuilder()
                .insert()
                .values([
                    {
                        creator: messageDto.creator,
                        channel: messageDto.channel,
                        content: messageDto.content
                    }
                ])
                .execute()
            return {
                message: 'message successfully created',
                channel: messageDto.channel
            };
        }
        catch(error) {
            return {
                message: 'message creation failed',
                channel: messageDto.channel
            };
        }
    }

    async removeOne(message: number) {
        try {
            await this.messageRepository.createQueryBuilder()
                .delete()
                .from(Message)
                .where('id = messageId', {id: message})
                .execute();
            return {
                message: 'message removed'
            };
        }
        catch(error) {
            return {
                message: 'message removal failed'
            };
        }
    }

    async removeAll(channel: number) {
        try {
            await this.messageRepository.createQueryBuilder()
                .delete()
                .from(Message)
                .where('channel = channelId', {channelId: channel})
                .execute();
            return {
                message: 'messages removed'
            };
        }
        catch(error) {
            return {
                message: 'messages removal failed'
            };
        }
    }
}