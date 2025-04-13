import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'dm_session' })
export class DmSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userAId: number;

  @Column()
  userBId: number;

  @Column()
  isOpen: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  userA: User;

  @ManyToOne(() => User, (user) => user.id)
  userB: User;
}
