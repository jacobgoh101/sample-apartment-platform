import { PERMISSIONS_KEY, Permission } from './permission.decorator';
import { getResourceId } from './rbac.constant';
import { RbacService } from './rbac.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = req;
    if (await this.rbacService.isAdmin(user?.id)) return true;
    return this.checkPermissions(requiredPermissions, req, user);
  }

  private checkPermissions(
    requiredPermissions: Permission[],
    req: any,
    user: any,
  ) {
    return Promise.all(
      requiredPermissions.map(({ action, resource, resourceIdCallBack }) => {
        const id = resourceIdCallBack(req);
        const resourceId = getResourceId(id, resource);
        return this.rbacService.hasPermissionForUser(
          user?.id,
          resourceId,
          action,
        );
      }),
    ).then((results) => results.every(Boolean));
  }
}
