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
import { AcceptFriendRequestDto } from 'src/friend/friend.dto';

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

      socket.join(this.userSocketsRoomName(payload.id));

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
    socket.leave(this.userSocketsRoomName(socket.data.user.id));

    this.logger.log(`Client disconnected: ${socket.id}`);
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
      .to(this.userSocketsRoomName(friendRequest.senderId))
      .emit('friend_request.accepted', acceptFriendRequestDto);

    return { event: 'friend_request.accept', data: acceptFriendRequestDto };
  }

  userSocketsRoomName(userId: number) {
    return `userSockets.${userId}`;
  }
}
