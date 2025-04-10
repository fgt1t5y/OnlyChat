import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';

@Module({
  controllers: [FriendController],
  imports: [TypeOrmModule.forFeature([FriendRequest])],
  providers: [FriendService],
})
export class FriendModule {}
