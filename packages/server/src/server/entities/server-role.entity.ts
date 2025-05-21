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

  @Column({ unique: true })
  name: string;

  @Column({ length: 8 })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Server, (server) => server.roles)
  server: Server;
}
