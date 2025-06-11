import { BadRequestException, Logger, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types';
import { FriendRequestService } from 'src/friend/friend-request.service';
import { WsCurrentUser } from 'src/common/decorators';
import {
  SendFriendRequestDto,
  AcceptFriendRequestDto,
  CancelFriendRequestDto,
} from 'src/friend/friend.dto';
import { UserService } from 'src/user/user.service';
import { FriendService } from 'src/friend/friend.service';
import { DMSessionService } from 'src/dm/dm-session.service';
import { CreateDMMessageDto } from 'src/dm/dm.dto';
import { DMMessageService } from 'src/dm/dm-message.service';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChatGateway');

  constructor(
    private readonly jwtService: JwtService,
    private readonly dmSessionService: DMSessionService,
    private readonly dmMessageService: DMMessageService,
    private readonly friendRequestService: FriendRequestService,
    private readonly friendService: FriendService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        throw new WsException('Invalid credentials.');
      }

      const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;

      socket.data.user = payload;

      await socket.join(this.roomUser(payload.id));
      await this.userService.updateIsOnline(payload.id, true);

      this.logger.log(
        `Client connected: ${socket.id} - User ID: ${payload.id}`,
      );
    } catch (error) {
      socket.emit('exception', 'Authentication error');
      socket.disconnect();

      this.logger.error(
        `Connection auth error for socket ${socket.id}: ${error.message}`,
      );
    }
  }

  async handleDisconnect(socket: Socket) {
    const userSocketCount = await socket
      .in(this.roomUser(socket.data.user.id))
      .fetchSockets();

    if (userSocketCount.length === 0) {
      await this.userService.updateIsOnline(socket.data.user.id, false);
    }

    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('dm_message.send')
  async handleSendDMMessage(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody() { dmSessionId, content }: CreateDMMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    if (!content.trim()) {
      throw new WsException('Content is required.');
    }

    const dmSession = await this.dmSessionService.findById(dmSessionId);

    const newDMMessage = await this.dmMessageService.create(
      dmSessionId,
      user.id,
      content,
    );

    const dmMessage = await this.dmMessageService.findById(newDMMessage.id);

    await this.dmSessionService.updateLastMessageId(
      user.id,
      dmSession.userBId,
      dmMessage.id,
    );

    socket
      .to(this.roomUser(dmSession.userBId))
      .emit('dm_message.received', dmMessage);

    return { event: 'dm_message.send', data: dmMessage };
  }

  @SubscribeMessage('friend_request.send')
  async handleSendFriendRequest(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody() { receiverId }: SendFriendRequestDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse> {
    const existingFrienRequest = await this.friendRequestService.findOne(
      user.id,
      receiverId,
    );

    if (existingFrienRequest) {
      throw new BadRequestException(
        'Friend request already exists between these users.',
      );
    }

    const friendRequest = await this.friendRequestService.create(
      user.id,
      receiverId,
    );

    socket
      .to(this.roomUser(friendRequest.senderId))
      .emit('friend_request.received', friendRequest);

    return { event: 'friend_request.send', data: friendRequest };
  }

  @SubscribeMessage('friend_request.accept')
  async handleAcceptFriendRequest(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody() acceptFriendRequestDto: AcceptFriendRequestDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse> {
    const friendRequest = await this.friendRequestService.accept(
      user.id,
      acceptFriendRequestDto.friendRequestId,
    );

    await this.friendService.createBothSideRelationship(
      user.id,
      friendRequest.senderId,
    );

    socket
      .to(this.roomUser(friendRequest.senderId))
      .emit('friend_request.accepted', acceptFriendRequestDto);

    return {
      event: 'friend_request.accept',
      data: acceptFriendRequestDto,
    };
  }

  @SubscribeMessage('friend_request.cancel')
  async handleCancelFriendRequest(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody() cancelFriendRequestDto: CancelFriendRequestDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse> {
    const friendRequest = await this.friendRequestService.cancel(
      user.id,
      cancelFriendRequestDto.friendRequestId,
    );

    socket
      .to(this.roomUser(friendRequest.receiverId))
      .emit('friend_request.canceled', cancelFriendRequestDto);

    return {
      event: 'friend_request.cancel',
      data: cancelFriendRequestDto,
    };
  }

  roomUser(userId: number) {
    return `user.${userId}`;
  }
}
