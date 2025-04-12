import { Logger, UseFilters } from '@nestjs/common';
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
  CreateFriendRequestDto,
  AcceptFriendRequestDto,
  CancelFriendRequestDto,
} from 'src/friend/friend.dto';
import { UserService } from 'src/user/user.service';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChatGateway');

  constructor(
    private readonly jwtService: JwtService,
    private readonly friendRequestService: FriendRequestService,
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
      socket.join(this.userSocketsRoom(payload.id));

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
      .in(this.userSocketsRoom(socket.data.user.id))
      .fetchSockets();

    await this.userService.updateIsOnline(
      socket.data.user.id,
      userSocketCount.length > 0,
    );

    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('friend_request.create')
  async handleCreateFriendRequest(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody() createFriendRequestDto: CreateFriendRequestDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse> {
    const friendRequest = await this.friendRequestService.create(
      user.id,
      createFriendRequestDto.receiverId,
    );

    socket
      .to(this.userSocketsRoom(friendRequest.senderId))
      .emit('friend_request.received', friendRequest);

    return { event: 'friend_request.create.success', data: friendRequest };
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

    socket
      .to(this.userSocketsRoom(friendRequest.senderId))
      .emit('friend_request.accepted', acceptFriendRequestDto);

    return {
      event: 'friend_request.accept.success',
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
      .to(this.userSocketsRoom(friendRequest.receiverId))
      .emit('friend_request.canceled', cancelFriendRequestDto);

    return {
      event: 'friend_request.cancel.success',
      data: cancelFriendRequestDto,
    };
  }

  userSocketsRoom(userId: number) {
    return `userSockets.${userId}`;
  }
}
