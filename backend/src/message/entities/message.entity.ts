import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() //Must be Many-to-one
    creator: number;

    @Column() //same here
    channel: number;

    @Column('text')
    content: string;
}