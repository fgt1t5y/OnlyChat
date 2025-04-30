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
    await this.userRepository.update({ id: userId }, { avatarUrl });
  }

  async updateIsOnline(userId: number, isOnline: boolean) {
    await this.userRepository.update(userId, {
      isOnline,
    });
  }
}
