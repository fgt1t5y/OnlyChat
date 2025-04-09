import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class ChatGateway {
  constructor() {}

  @WebSocketServer()
  server: Server;

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): WsResponse {
    return { event: 'message', data: data };
  }
}
