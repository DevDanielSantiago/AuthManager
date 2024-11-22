import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '../decorators';
import { ForbiddenException } from '../exception';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.permissions)
      throw new ForbiddenException('Access Denied');

    const hasPermission = requiredPermissions.filter((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasPermission.length) throw new ForbiddenException('Access Denied');

    return true;
  }
}
