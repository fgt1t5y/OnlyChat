import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendRequest } from './friend-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async findOne(friendRequestId: number) {
    return await this.friendRequestRepository.findOne({
      where: {
        id: friendRequestId,
      },
    });
  }

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

  async accept(userId: number, friendRequestId: number) {
    const friendRequest = await this.findOne(friendRequestId);

    if (!friendRequest || friendRequest.receiverId !== userId) {
      throw new NotFoundException('Friend request not found.');
    }

    return await this.friendRequestRepository.update(friendRequestId, {
      accepted: true,
    });
  }

  async cancle(userId: number, friendRequestId: number) {
    const friendRequest = await this.findOne(friendRequestId);

    if (!friendRequest || friendRequest.senderId !== userId) {
      throw new NotFoundException('Friend request not found.');
    }

    return await this.friendRequestRepository.delete(friendRequestId);
  }
}
