import { Injectable } from '@nestjs/common';
import { Friend } from './entities/friend.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class FriendService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}

  async findAll(userId: number): Promise<User[]> {
    const friends = await this.friendRepository.find({
      relations: {
        userB: true,
      },
      where: {
        userAId: userId,
      },
    });

    return friends.map((item) => item.userB);
  }

  async createBothSideRelationship(userAId: number, userBId: number) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    try {
      await qr.manager.save(Friend, {
        userAId: userAId,
        userBId: userBId,
      });
      await qr.manager.save(Friend, {
        userAId: userBId,
        userBId: userAId,
      });

      await qr.commitTransaction();
    } catch {
      await qr.rollbackTransaction();
    } finally {
      await qr.release();
    }
  }
}
