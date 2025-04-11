import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [FriendModule],
  providers: [ChatGateway],
})
export class ChatModule {}
