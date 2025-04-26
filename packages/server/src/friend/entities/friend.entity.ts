import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'friends' })
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userAId: number;

  @Column()
  userBId: number;

  @Column({ length: 32, nullable: true })
  noteName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  userA: User;

  @ManyToOne(() => User, (user) => user.id)
  userB: User;
}
