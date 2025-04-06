import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  create(): Promise<Role> {
    const role = new Role();

    role.name = 'Admin';
    role.description = 'A test role.';
    role.color = '#00ff00';

    return this.roleRepository.save(role);
  }
}
