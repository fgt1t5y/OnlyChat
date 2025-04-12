import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, FriendRequest } from './entity';
import { FriendRequestService } from './friend-request.service';

@Module({
  controllers: [FriendRequestController],
  imports: [TypeOrmModule.forFeature([FriendRequest, Friend])],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendModule {}
