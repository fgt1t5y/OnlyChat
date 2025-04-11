import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './friend-request.entity';
import { FriendRequestService } from './friend-request.service';

@Module({
  controllers: [FriendRequestController],
  imports: [TypeOrmModule.forFeature([FriendRequest])],
  providers: [FriendRequestService],
})
export class FriendModule {}
