import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner: number;

    @Column({ unique: true })
    name: string;

    @Column()
    type: string;

    @Column({ nullable: true })
    password: string;
}
