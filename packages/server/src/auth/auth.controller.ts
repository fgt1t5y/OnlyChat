import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { FileInterceptor } from '@nestjs/platform-express';

import type { UserLoginDto, UserRegisterDto } from './auth.dto';

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

  @Post('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() body: Partial<User>,
  ): Promise<Partial<User>> {
    return await this.authService.updateProfile(user.id, body);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() avatarFile: Express.Multer.File,
  ): Promise<Partial<User>> {
    return { avatarUrl: avatarFile.filename };
  }
}
