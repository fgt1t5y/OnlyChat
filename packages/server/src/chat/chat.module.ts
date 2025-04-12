import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { FriendModule } from 'src/friend/friend.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [FriendModule, UserModule],
  providers: [ChatGateway],
})
export class ChatModule {}
