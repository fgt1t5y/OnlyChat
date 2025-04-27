import { Channel } from 'src/channel/entities';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'servers' })
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: number;

  @Column({ length: 64 })
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  avatarClass: string;

  @Column({ default: 0 })
  memberCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @ManyToMany(() => User, (user) => user.id)
  members: User[];

  @OneToMany(() => Channel, (channel) => channel.server)
  channels: Channel[];
}
