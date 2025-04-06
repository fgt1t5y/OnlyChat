import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

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

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    return data;
  }
}
