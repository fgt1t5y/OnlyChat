import { Controller, Get } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  create(): Promise<Role> {
    return this.roleService.create();
  }
}
