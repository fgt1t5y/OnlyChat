import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find')
  @UseGuards(JwtAuthGuard)
  async find(@Query('searchKeyword') searchKeyword: string) {
    return this.userService.findBy(searchKeyword);
  }
}
