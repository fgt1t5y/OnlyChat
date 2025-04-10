import { Logger, UseFilters } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
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

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection {
  private readonly logger = new Logger('ChatGateway');

  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.token;

    try {
      if (!token) {
        throw new WsException('Invalid credentials.');
      }

      const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;

      socket.data.userId = payload.sub;

      this.logger.log(
        `Client connected: ${socket.id} - User ID: ${payload.sub}`,
      );
    } catch (error) {
      this.logger.error(
        `Connection auth error for socket ${socket.id}: ${error.message}`,
      );

      socket.emit('exception', 'Authentication error');
      socket.disconnect();
    }
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): WsResponse {
    return { event: 'message', data: data };
  }
}
