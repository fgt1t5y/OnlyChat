import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'channel_groups' })
export class ChannelGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serverId: number;

  @Column()
  creatorId: number;

  @Column({ nullable: true })
  nextGroupId: number;

  @Column({ length: 64, nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;
}
