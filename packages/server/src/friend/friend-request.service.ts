import { Injectable } from '@nestjs/common';
import { FriendRequest } from './entities/friend-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async findAllReceivedBy(receiverId: number): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      where: {
        receiverId: receiverId,
      },
    });
  }

  async findAllSentBy(senderId: number): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      where: {
        senderId: senderId,
      },
    });
  }

  async create({ senderId, receiverId, description }: SendFriendRequestDto) {
    const friendRequest = this.friendRequestRepository.create({
      senderId,
      receiverId,
      description,
    });

    return await this.friendRequestRepository.save(friendRequest);
  }
}
