import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PasswordTransformer } from './password.transformer';
import { Role } from 'src/role/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ length: 64, transformer: new PasswordTransformer() })
  password: string;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'longtext', nullable: true })
  meta: string;

  @ManyToMany(() => Role, (role) => role.id)
  @JoinTable()
  roles: Role[];
}
