import { CASBIN_PROVIDERS, ROLES } from './rbac.constant';
import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';

@Injectable()
export class RbacService {
  constructor(
    @Inject(CASBIN_PROVIDERS.CASBIN_ENFORCER)
    private readonly enforcer: Enforcer,
  ) {}

  async seedPolicies() {
    // user with ID 1 is admin
    await this.enforcer.addGroupingPolicy('1', ROLES.ADMIN);

    // admin can assume all realtor roles
    await this.enforcer.addGroupingPolicy(ROLES.ADMIN, ROLES.REALTOR);
  }

  addRolesForUser(userId: number, role: ROLES) {
    return this.enforcer.addRoleForUser(userId?.toString(), role);
  }

  getRolesForUser(userId: number) {
    return this.enforcer.getRolesForUser(userId?.toString());
  }

  async hasRolesForUser(userId: number, requiredRoles: ROLES[]) {
    const roles = await this.getRolesForUser(userId);
    return requiredRoles.every((role) => roles.includes(role));
  }

  isAdmin(userId: number) {
    return this.hasRolesForUser(userId, [ROLES.ADMIN]);
  }

  addPermissionForUser(userId: number, resourceId: string, action: string) {
    this.enforcer.addPermissionForUser(userId?.toString(), resourceId, action);
  }

  hasPermissionForUser(userId: number, resourceId: string, action: string) {
    return this.enforcer.hasPermissionForUser(
      userId?.toString(),
      resourceId,
      action,
    );
  }
}