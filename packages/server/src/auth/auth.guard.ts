import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { JwtPayload } from 'src/common/types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization as string;

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request.user = payload;
    } catch {
      return false;
    }

    return true;
  }
}
