import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DMMessage } from './dm-message.entity';

@Entity({ name: 'dm_sessions' })
export class DMSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userAId: number;

  @Column()
  userBId: number;

  @Column({ nullable: true })
  lastMessageId: number;

  @Column()
  isOpen: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  userA: User;

  @ManyToOne(() => User, (user) => user.id)
  userB: User;

  @OneToOne(() => DMMessage, (dmMessage) => dmMessage.id)
  lastMessage: DMMessage;

  @OneToMany(() => DMMessage, (dmMessage) => dmMessage.sessionId)
  message: DMMessage[];
}
