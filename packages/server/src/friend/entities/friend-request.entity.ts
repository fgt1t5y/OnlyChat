import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'friend_request' })
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  senderId: number;

  @Index()
  @Column()
  receiverId: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  accepted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.id)
  sender: User;

  @OneToOne(() => User, (user) => user.id)
  receiver: User;
}
