import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendRequest } from './entities/friend-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async findOneById(friendRequestId: number) {
    return await this.friendRequestRepository.findOne({
      where: {
        id: friendRequestId,
      },
    });
  }

  async findOne(senderId: number, receiverId: number) {
    return await this.friendRequestRepository.findOne({
      relations: {
        receiver: true,
        sender: true,
      },
      where: {
        senderId: senderId,
        receiverId: receiverId,
      },
    });
  }

  async findAll(userId: number): Promise<FriendRequest[]> {
    return this.friendRequestRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.receiver', 'receiver')
      .leftJoinAndSelect('friend.sender', 'sender')
      .where('friend.receiverId = :userId OR friend.senderId = :userId', {
        userId: userId,
      })
      .getMany();
  }

  async create(senderId: number, receiverId: number): Promise<FriendRequest> {
    const friendRequest = new FriendRequest();

    friendRequest.senderId = senderId;
    friendRequest.receiverId = receiverId;

    await this.friendRequestRepository.save(friendRequest);

    return await this.friendRequestRepository.findOne({
      relations: {
        receiver: true,
        sender: true,
      },
      where: {
        senderId,
        receiverId,
      },
    });
  }

  async accept(
    userId: number,
    friendRequestId: number,
  ): Promise<FriendRequest> {
    const friendRequest = await this.findOneById(friendRequestId);

    if (
      !friendRequest ||
      friendRequest.accepted ||
      friendRequest.receiverId !== userId
    ) {
      throw new NotFoundException('Friend request not found.');
    }

    await this.friendRequestRepository.update(friendRequestId, {
      accepted: true,
    });

    return friendRequest;
  }

  async cancel(userId: number, friendRequestId: number) {
    const friendRequest = await this.findOneById(friendRequestId);

    if (!friendRequest || friendRequest.senderId !== userId) {
      throw new NotFoundException('Friend request not found.');
    }

    await this.friendRequestRepository.delete(friendRequestId);

    return friendRequest;
  }

  async deny(userId: number, friendRequestId: number) {
    const friendRequest = await this.findOneById(friendRequestId);

    if (!friendRequest || friendRequest.receiverId !== userId) {
      throw new NotFoundException('Friend request not found.');
    }

    await this.friendRequestRepository.delete(friendRequestId);

    return friendRequest;
  }
}
