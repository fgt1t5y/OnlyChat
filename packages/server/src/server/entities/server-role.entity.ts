import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Server } from './server.entity';

@Entity({ name: 'server_roles' })
export class ServerRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serverId: number;

  @Column()
  name: string;

  @Column({ default: '42B883', length: 6 })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Server, (server) => server.roles)
  server: Server;
}
