import {
  Injectable,
  Request,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { comparePassword } from 'src/utils';

import type { UserLoginDto, UserRegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: UserLoginDto) {
    if (!username || !password) {
      throw new BadRequestException('Username or password is required.');
    }

    const user = await this.userRepository.findOne({
      select: ['username', 'password', 'disabled'],
      where: {
        username: username,
      },
    });

    if (user.disabled) {
      throw new ForbiddenException('User is disabled.');
    }

    if (!user || !comparePassword(password, user.password)) {
      throw new UnauthorizedException(
        'User is not existing or wrong password.',
      );
    }

    const jwtPayload = {
      sub: user.id,
      username: username,
    };

    return { token: await this.jwtService.signAsync(jwtPayload) };
  }

  async register({ username, password }: UserRegisterDto) {
    if (!username || !password) {
      throw new BadRequestException('Username or password is required.');
    }

    if (this.userRepository.existsBy({ username })) {
      throw new BadRequestException(`Username ${username} already exists.`);
    }

    const user = await this.userRepository.create({
      displayName: username,
      username: username,
      password: password,
    });

    delete user.password;

    return user;
  }

  async profile(@Request() request: any) {
    const userId = request.user.id as number;

    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }
}
