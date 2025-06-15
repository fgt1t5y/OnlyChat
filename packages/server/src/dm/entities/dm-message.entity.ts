import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Attachment } from 'src/attachment/attachment.entity';
import { DMSession } from './dm-session.entity';

@Entity({ name: 'dm_messages' })
export class DMMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  sessionId: number;

  @Column({ length: 1000 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @ManyToOne(() => DMSession, (dmSession) => dmSession.id)
  session: DMSession;

  @ManyToMany(() => Attachment, (attachment) => attachment.id)
  @JoinTable({ name: 'dm_message_attachments' })
  attachments: Attachment[];
}
