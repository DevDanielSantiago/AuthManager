import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

import { PERMISSIONS_KEY } from '../decorators';
import { ForbiddenException } from '../exception';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

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
