import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/role/role.entity';
import { ok } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create() {
    const user = new User();
    const adminRole = await this.roleRepository.findOneBy({ id: 1 });

    user.username = 'admin5';
    user.password = 'test';
    user.disabled = false;
    user.roles = [adminRole];

    return this.userRepository.save(user);
  }

  async roles() {
    const user = await this.userRepository.findOne({
      relations: {
        roles: true,
      },
      where: {
        id: 1,
      },
    });

    return ok(user.roles);
  }

  async permissions() {
    const role = await this.roleRepository.findOne({
      relations: {
        permissions: true,
      },
      where: {
        id: 1,
      },
    });

    return ok(role.permissions);
  }

  async list() {
    const users = await this.userRepository.find({
      relations: {
        roles: true,
      },
    });

    return ok(users);
  }
}
