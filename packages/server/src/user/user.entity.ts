import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { PasswordTransformer } from './password.transformer';
import { Role } from 'src/role/role.entity';
import { FriendRequest } from 'src/friend/friend-request.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32 })
  displayName: string;

  @Column({ unique: true, length: 32 })
  username: string;

  @Column({ length: 64, nullable: true })
  email: string;

  @Column({ default: '', length: 250, nullable: true })
  introduction: string;

  @Column({ length: 64, transformer: new PasswordTransformer(), select: false })
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 0 })
  avatarVersion: number;

  @Column({ default: false })
  disabled: boolean;

  @Column({ default: false })
  isOnline: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.id)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[];
}
