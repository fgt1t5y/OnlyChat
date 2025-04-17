import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serverId: number;

  @Column({ nullable: true })
  groupId: number;

  @Column()
  creatorId: number;

  @Column()
  nextChannelId: number;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 200 })
  description: string;

  @Column({ nullable: true })
  iconClass: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;
}
