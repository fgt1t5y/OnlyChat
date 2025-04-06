import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/role.entity';
import { In, Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permissionRequired = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    
    if (permissionRequired.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRoles = request.user.roles as number[];

    if (userRoles.length === 0) {
      return false;
    }

    const roles = await this.roleRepository.find({
      relations: {
        permissions: true,
      },
      where: {
        id: In(userRoles),
      },
    });
    const userPermissions = roles.reduce((total, current) => {
      total.push(...current.permissions);
      return total;
    }, []);

    return userPermissions.some((permission: Permission) =>
      permissionRequired.includes(permission.name),
    );
  }
}
