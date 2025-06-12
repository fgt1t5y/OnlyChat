import {
  Controller,
  Get,
  BadRequestException,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@Query('username') username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const user = await this.userService.findBy(username);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
