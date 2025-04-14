import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { FriendModule } from 'src/friend/friend.module';
import { UserModule } from 'src/user/user.module';
import { DMModule } from 'src/dm/dm.module';

@Module({
  imports: [FriendModule, UserModule, DMModule],
  providers: [ChatGateway],
})
export class ChatModule {}
