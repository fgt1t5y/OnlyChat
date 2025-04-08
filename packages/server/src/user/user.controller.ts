import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async create() {
    return this.userService.create();
  }

  @Get('roles')
  async roles() {
    return this.userService.roles();
  }

  @Get('permissions')
  async permissions() {
    return this.userService.permissions();
  }

  @Get('list')
  async list() {
    return this.userService.list();
  }
}
