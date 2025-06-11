import { Injectable, Logger, UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';
import { JwtPayload } from 'src/common/types';
import { UserService } from 'src/user/user.service';

@Injectable()
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChatGateway');

  constructor(
    private readonly jwtService: JwtService,
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

      await socket.join(this.user(payload.id));
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
      .in(this.user(socket.data.user.id))
      .fetchSockets();

    if (userSocketCount.length === 0) {
      await this.userService.updateIsOnline(socket.data.user.id, false);
    }

    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  public user(userId: number) {
    return `user.${userId}`;
  }

  public broadcastToUser(userId: number, ev: string, ...args: any[]) {
    this.server.to(this.user(userId)).emit(ev, ...args);
  }
}
