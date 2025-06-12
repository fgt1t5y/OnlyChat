import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'friend_requests' })
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @Column({ default: false })
  accepted: boolean;

  @Column({ default: false })
  denied: boolean;

  @Column({ default: false })
  canceled: boolean;

  @Column({ default: false })
  resolved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  receiver: User;

  @ManyToOne(() => User, (user) => user.id)
  sender: User;
}
