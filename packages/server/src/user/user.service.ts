import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
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

  async updateIsOnline(userId: number, isOnline: boolean): Promise<boolean> {
    await this.userRepository.update(userId, {
      isOnline,
    });

    return isOnline;
  }
}
