import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendRequestService } from './friend-request.service';

@Module({
  controllers: [FriendController],
  imports: [TypeOrmModule.forFeature([FriendRequest])],
  providers: [FriendRequestService],
})
export class FriendModule {}
