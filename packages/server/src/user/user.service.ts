import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';
import { no, ok } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async search(searchKeyword: string) {
    if (!searchKeyword) {
      return no(HttpStatus.BAD_REQUEST, 'Search keyword is required');
    }

    const users = await this.userRepository.find({
      where: {
        username: Like(`%${searchKeyword}%`),
      },
    });

    return ok(users);
  }
}
