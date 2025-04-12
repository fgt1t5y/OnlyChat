import { Logger, UseFilters } from '@nestjs/common';
import {
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
    const token = socket.handshake.auth?.token;

    try {
      if (!token) {
        throw new WsException('Invalid credentials.');
      }

      const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;

      socket.data.user = payload;

      this.logger.log(
        `Client connected: ${socket.id} - User ID: ${payload.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Connection auth error for socket ${socket.id}: ${error.message}`,
      );

      socket.emit('exception', 'Authentication error');
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('friend_request.accept')
  async handleAcceptFriendRequest(
    @WsCurrentUser() user: JwtPayload,
    @MessageBody() acceptFriendRequestDto: AcceptFriendRequestDto,
  ): Promise<WsResponse> {
    await this.friendRequestService.accept(
      user.id,
      acceptFriendRequestDto.friendRequestId,
    );

    return { event: 'message', data: true };
  }
}
