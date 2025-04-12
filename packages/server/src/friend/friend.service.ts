import { Injectable } from '@nestjs/common';
import { Friend } from './entity/friend.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}

  async findAll(userId: number): Promise<Friend[]> {
    return await this.friendRepository.find({
      relations: {
        userB: true,
      },
      where: {
        userAId: userId,
      },
    });
  }
}
