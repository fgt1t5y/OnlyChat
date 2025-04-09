import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
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
export class MessageGateway implements OnGatewayConnection {
  constructor() {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): WsResponse {
    return { event: 'message', data: data };
  }
}
