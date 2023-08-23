import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  receiver: string;
}
