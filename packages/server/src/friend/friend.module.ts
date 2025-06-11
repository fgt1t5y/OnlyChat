import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from 'src/event/event.module';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { Friend, FriendRequest } from './entities';

@Module({
  controllers: [FriendRequestController, FriendController],
  imports: [TypeOrmModule.forFeature([FriendRequest, Friend]), EventModule],
  providers: [FriendRequestService, FriendService],
  exports: [FriendRequestService, FriendService],
})
export class FriendModule {}
