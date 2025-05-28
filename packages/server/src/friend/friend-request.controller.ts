import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { SendFriendRequestDto, AcceptFriendRequestDto } from './friend.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: JwtPayload) {
    return await this.friendRequestService.findAll(user.id);
  }

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendRequest(
    @CurrentUser() user: JwtPayload,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ) {
    const existingFrienRequest = await this.friendRequestService.findOne(
      user.id,
      sendFriendRequestDto.receiverId,
    );

    if (existingFrienRequest) {
      throw new BadRequestException(
        'Friend request already exists between these users.',
      );
    }

    return this.friendRequestService.create(
      user.id,
      sendFriendRequestDto.receiverId,
    );
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  acceptRequest(
    @CurrentUser() user: JwtPayload,
    @Body() acceptFriendRequestDto: AcceptFriendRequestDto,
  ) {
    return this.friendRequestService.accept(
      user.id,
      acceptFriendRequestDto.friendRequestId,
    );
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  cancelRequest(
    @CurrentUser() user: JwtPayload,
    @Body() acceptFriendRequestDto: AcceptFriendRequestDto,
  ) {
    return this.friendRequestService.cancel(
      user.id,
      acceptFriendRequestDto.friendRequestId,
    );
  }
}
