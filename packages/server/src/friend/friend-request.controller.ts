import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types';

@Controller('friend/request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Get('received')
  @UseGuards(JwtAuthGuard)
  async findAllReceived(@CurrentUser() user: JwtPayload) {
    return await this.friendRequestService.findAllReceivedBy(user.id);
  }

  @Get('sent')
  @UseGuards(JwtAuthGuard)
  async findAllSent(@CurrentUser() user: JwtPayload) {
    return await this.friendRequestService.findAllSentBy(user.id);
  }

  @Post('request')
  @UseGuards(JwtAuthGuard)
  createRequest(@Body() sendFriendRequestDto: SendFriendRequestDto) {
    return this.friendRequestService.create(sendFriendRequestDto);
  }
}
