import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Get('received')
  @UseGuards(JwtAuthGuard)
  findAllReceived(@CurrentUser() user: JwtPayload) {
    return this.friendRequestService.findAllReceivedBy(user.sub);
  }

  @Get('sent')
  @UseGuards(JwtAuthGuard)
  findAllSent(@CurrentUser() user: JwtPayload) {
    return this.friendRequestService.findAllSentBy(user.sub);
  }

  @Post('request')
  @UseGuards(JwtAuthGuard)
  createRequest(@Body() sendFriendRequestDto: SendFriendRequestDto) {
    return this.friendRequestService.create(sendFriendRequestDto);
  }
}
