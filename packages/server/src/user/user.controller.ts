import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUser(@Query('username') username: string) {
    const user = await this.userService.findBy(username);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('_'))
  async uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    return await this.userService.updateAvatar(user.id, avatarFile.filename);
  }
}
