import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtPayload } from '../types';

export const WsCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    const client: Socket = context.switchToWs().getClient<Socket>();

    return client.data.user;
  },
);
