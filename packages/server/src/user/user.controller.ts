import {
  Controller,
  Get,
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

  @Get('find')
  @UseGuards(JwtAuthGuard)
  async findUser(@Query('searchKeyword') searchKeyword: string) {
    return this.userService.findBy(searchKeyword);
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
