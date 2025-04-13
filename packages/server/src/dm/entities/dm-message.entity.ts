import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DmSession } from './dm-session.entity';
import { User } from 'src/user/user.entity';
@Entity({ name: 'dm_message' })
export class DmMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  sessionId: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @ManyToOne(() => DmSession, (dmSession) => dmSession.id)
  session: DmSession;
}
