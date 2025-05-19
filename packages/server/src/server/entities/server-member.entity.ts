import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Server } from './server.entity';

@Entity({ name: 'server_members' })
export class ServerMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serverId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Server, (server) => server.id)
  server: Server;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
