import {
  Injectable,
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
      select: ['id', 'username', 'password', 'disabled'],
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
      id: user.id,
      username: username,
    };

    return { token: await this.jwtService.signAsync(jwtPayload) };
  }

  async register({ username, password }: UserRegisterDto) {
    if (!username || !password) {
      throw new BadRequestException('Username or password is required.');
    }

    if (await this.userRepository.existsBy({ username })) {
      throw new BadRequestException(`Username ${username} already exists.`);
    }

    const user = this.userRepository.create({
      displayName: username,
      username: username,
      password: password,
    });

    delete user.password;

    return await this.userRepository.save(user);
  }

  async getProfile(request: any) {
    const userId = request.user.id as number;

    return await this.userRepository.findOne({
      relations: {
        joinedServers: {
          server: {
            creator: true,
            channels: true,
          },
        },
      },
      where: {
        id: userId,
      },
      order: {
        joinedServers: {
          server: {
            channels: {
              position: 'ASC',
            },
          },
        },
      },
    });
  }

  async updateProfile(userId: number, patchedUser: Partial<User>) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (patchedUser.displayName) {
      user.displayName = patchedUser.displayName;
    }

    if (patchedUser.avatarUrl) {
      user.avatarUrl = patchedUser.avatarUrl;
    }

    if (
      patchedUser.bannerColor &&
      /^([0-9a-f]{6}|[0-9a-f]{3})$/i.test(patchedUser.bannerColor)
    ) {
      user.bannerColor = patchedUser.bannerColor;
    }

    if (patchedUser.introduction !== null) {
      user.introduction = patchedUser.introduction;
    }

    await this.userRepository.save(user);

    return patchedUser;
  }
}
