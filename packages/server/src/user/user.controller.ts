import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find')
  async find(@Query('searchKeyword') searchKeyword: string) {
    return this.userService.search(searchKeyword);
  }
}
