import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

import type { UserLoginDto, UserRegisterDto } from './auth.dto';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: UserLoginDto) {
    return await this.authService.login(body);
  }

  @Post('register')
  async resgister(@Body() body: UserRegisterDto) {
    return await this.authService.register(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() request: any) {
    return await this.authService.getProfile(request);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() body: Partial<User>,
  ) {
    return await this.authService.updateProfile(user.id, body);
  }
}
