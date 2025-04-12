import { Controller, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFriends(@CurrentUser() user: JwtPayload) {
    return await this.friendService.findAll(user.id);
  }
}
