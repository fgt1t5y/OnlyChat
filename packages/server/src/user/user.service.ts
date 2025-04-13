import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findBy(searchKeyword: string): Promise<User[]> {
    if (!searchKeyword) {
      throw new BadRequestException('Search keyword is required');
    }

    return await this.userRepository.find({
      where: {
        username: Like(`%${searchKeyword}%`),
      },
    });
  }

  async updateAvatar(userId: number, avatarUrl: string | null) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    try {
      await qr.manager.update(User, { id: userId }, { avatarUrl });

      if (avatarUrl) {
        await qr.manager.increment(User, { id: userId }, 'avatarVersion', 1);
      }

      await qr.commitTransaction();
    } catch {
      await qr.rollbackTransaction();
    } finally {
      await qr.release();
    }
  }

  async updateIsOnline(userId: number, isOnline: boolean): Promise<boolean> {
    await this.userRepository.update(userId, {
      isOnline,
    });

    return isOnline;
  }
}
