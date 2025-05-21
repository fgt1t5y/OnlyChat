import { Channel } from 'src/channel/entities';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServerMember } from './server-member.entity';
import { ServerRole } from './server-role.entity';

@Entity({ name: 'servers' })
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: number;

  @Column({ length: 64 })
  name: string;

  @Column({ nullable: true })
  avatarUrl: string | null;

  @Column({ nullable: true })
  avatarClass: string;

  @Column({ default: 0 })
  memberCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.servers)
  creator: User;

  @OneToMany(() => Channel, (channel) => channel.server)
  channels: Channel[];

  @OneToMany(() => ServerMember, (serverMember) => serverMember.server)
  members: ServerMember[];

  @OneToMany(() => ServerRole, (serverRole) => serverRole.server)
  roles: ServerRole[];
}
