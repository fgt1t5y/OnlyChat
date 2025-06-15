import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Attachment } from 'src/attachment/attachment.entity';
import { Channel } from './channel.entity';

@Entity({ name: 'channel_messages' })
export class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  channelId: number;

  @Column({ length: 1000 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @ManyToOne(() => Channel, (channel) => channel.id)
  channel: Channel;

  @ManyToMany(() => Attachment, (attachment) => attachment.id)
  @JoinTable({ name: 'channel_message_attachments' })
  attachments: Attachment[];
}
