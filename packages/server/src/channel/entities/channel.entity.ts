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

  @Column()
  position: number;

  @Column()
  serverId: number;

  @Column()
  creatorId: number;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 200 })
  description: string;

  @Column({ nullable: true })
  iconClass: string;

  @Column({ default: false })
  isGroup: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Server, (server) => server.id)
  server: Server;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;
}
