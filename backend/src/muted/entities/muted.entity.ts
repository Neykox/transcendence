import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../../channels/entities/channel.entity";
import { User } from "../../entities/user.entity";

@Entity()
export class Muted {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() // Must be ManyToOne at the end and type set to Channel entity
    channel: number;

    @Column() // Same
    user: number;

    @Column({type: 'date'})
    until: Date;
}