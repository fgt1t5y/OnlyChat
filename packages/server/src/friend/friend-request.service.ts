import { Injectable } from '@nestjs/common';
import { FriendRequest } from './entities/friend-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async findAllReceivedBy(receiverId: number): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      relations: {
        sender: true,
      },
      where: {
        receiverId: receiverId,
      },
    });
  }

  async findAllSentBy(senderId: number): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      relations: {
        receiver: true,
      },
      where: {
        senderId: senderId,
      },
    });
  }

  create(senderId: number, receiverId: number): FriendRequest {
    return this.friendRequestRepository.create({
      senderId,
      receiverId,
    });
  }
}
