import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/types';
import { EventGateway } from 'src/event/event.gateway';
import { FriendRequestService } from './friend-request.service';
import { FriendService } from './friend.service';
import { SendFriendRequestDto, AcceptFriendRequestDto } from './friend.dto';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(
    private readonly eventGateway: EventGateway,
    private readonly friendRequestService: FriendRequestService,
    private readonly friendService: FriendService,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: JwtPayload) {
    return await this.friendRequestService.findAll(user.id);
  }

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendRequest(
    @CurrentUser() user: JwtPayload,
    @Body() data: SendFriendRequestDto,
  ) {
    const existingFrienRequest = await this.friendRequestService.findOne(
      user.id,
      data.receiverId,
    );

    if (existingFrienRequest) {
      throw new BadRequestException(
        'Friend request already exists between these users.',
      );
    }

    const friendRequest = await this.friendRequestService.create(
      user.id,
      data.receiverId,
    );

    this.eventGateway.broadcastToUser(
      friendRequest.senderId,
      'friend_request.received',
      friendRequest,
    );

    return friendRequest;
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptRequest(
    @CurrentUser() user: JwtPayload,
    @Body() data: AcceptFriendRequestDto,
  ) {
    const friendRequest = await this.friendRequestService.accept(
      user.id,
      data.friendRequestId,
    );

    await this.friendService.createBothSideRelationship(
      user.id,
      friendRequest.senderId,
    );

    this.eventGateway.broadcastToUser(
      friendRequest.senderId,
      'friend_request.accepted',
      data,
    );
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelRequest(
    @CurrentUser() user: JwtPayload,
    @Body() data: AcceptFriendRequestDto,
  ) {
    const friendRequest = await this.friendRequestService.cancel(
      user.id,
      data.friendRequestId,
    );

    this.eventGateway.broadcastToUser(
      friendRequest.receiverId,
      'friend_request.canceled',
      data,
    );
  }
}
