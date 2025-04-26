import { Server } from 'src/server/server.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  rootChannelId: number;

  @Column()
  position: number;

  @Column()
  serverId: number;

  @Column()
  creatorId: number;

  @Column({ length: 64 })
  name: string;

  @Column({ default: '', length: 200, nullable: true })
  description: string;

  @Column({ nullable: true })
  iconClass: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Server, (server) => server.channels)
  server: Server;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;
}
