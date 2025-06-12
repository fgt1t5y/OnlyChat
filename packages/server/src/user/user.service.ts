import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findBy(username: string): Promise<User> {
    return await this.userRepository.findOneBy({
      username: username,
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
