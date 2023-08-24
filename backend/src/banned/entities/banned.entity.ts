import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../../channels/entities/channel.entity";
import { User } from "../../entities/user.entity";

@Entity()
export class Banned {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() // Must be ManyToOne at the end and refer to Channel entity
    channel: number;

    @Column() // Same
    userId: number;

    @Column() // Same
    login: string;
}