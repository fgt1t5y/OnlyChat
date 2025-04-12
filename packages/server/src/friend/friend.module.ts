import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, FriendRequest } from './entity';
import { FriendRequestService } from './friend-request.service';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  controllers: [FriendRequestController, FriendController],
  imports: [TypeOrmModule.forFeature([FriendRequest, Friend])],
  providers: [FriendRequestService, FriendService],
  exports: [FriendRequestService, FriendService],
})
export class FriendModule {}
