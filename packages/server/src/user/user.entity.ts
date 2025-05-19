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
import { ServerMember } from 'src/server/entities';

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
  avatarUrl: string | null;

  @Column({ nullable: true })
  bannerImageUrl: string | null;

  @Column({ default: '42B883', length: 6 })
  bannerColor: string;

  @Column({ default: false })
  disabled: boolean;

  @Column({ default: false })
  isOnline: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.id)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @OneToMany(() => ServerMember, (serverMember) => serverMember.user)
  joinedServers: ServerMember[];
}
