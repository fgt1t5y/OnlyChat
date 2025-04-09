import { Injectable, HttpStatus, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { comparePassword, ok, no } from 'src/utils';

import type { UserLoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: UserLoginDto) {
    if (!username || !password) {
      return no(HttpStatus.BAD_REQUEST, 'Username or password is required.');
    }

    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (user.disabled) {
      return no(HttpStatus.FORBIDDEN, 'User is disabled.');
    }

    if (!user || !comparePassword(password, user.password)) {
      return no(
        HttpStatus.UNAUTHORIZED,
        'User is not existing or wrong password.',
      );
    }

    const jwtPayload = {
      sub: user.id,
      username: username,
    };

    return ok({ token: await this.jwtService.signAsync(jwtPayload) });
  }

  async profile(@Request() request: any) {
    const userId = request.user.id as number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return ok(rest);
  }
}
