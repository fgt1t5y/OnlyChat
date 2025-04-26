import { Server } from 'src/server/server.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelGroup } from './channel-group.entity';

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

  @ManyToOne(() => Server, (server) => server.id)
  server: Server;

  @ManyToOne(() => ChannelGroup, (channelGroup) => channelGroup.id)
  group: ChannelGroup;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;
}
