import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { channelTypesDto } from "../dto";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner: number;

    @Column({ unique: true })
    name: string;

    @Column({
        type: 'enum',
        enum: channelTypesDto,
        default: channelTypesDto.PUBLIC,
    })
    type: channelTypesDto;

    @Column({ nullable: true })
    password: string;
}
