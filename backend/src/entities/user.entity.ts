import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  pseudo?: string;

  @Column({ unique: true })
  login: string;

  @Column({ default: "offline" })
  status: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ default: false })
  is2FaActive: boolean;

  @Column({ nullable: true })
  twoFaSecret?: string;

  @Column({ nullable: true})
  token?: string;

  @Column({ nullable: true})
  image?: string;
}
