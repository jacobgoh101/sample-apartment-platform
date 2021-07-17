import {
  CASBIN_PROVIDERS,
  RESOURCE,
  RESOURCE_ACTION,
  ROLES,
} from './rbac.constant';
import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

@Injectable()
export class RbacService {
  constructor(
    @Inject(CASBIN_PROVIDERS.CASBIN_ENFORCER)
    private readonly enforcer: Enforcer,
  ) {
    setInterval(() => {
      this.enforcer.loadPolicy();
    }, dayjs.duration(1, 'minute').asMilliseconds());
  }

  async seedPolicies() {
    // user with ID 1 is admin
    await this.enforcer.addGroupingPolicy('1', ROLES.ADMIN);

    // admin can assume all realtor roles
    await this.enforcer.addGroupingPolicy(ROLES.ADMIN, ROLES.REALTOR);
    await this.enforcer.addGroupingPolicy(ROLES.ADMIN, ROLES.CLIENT);

    await this.enforcer.addPermissionForUser(
      ROLES.REALTOR,
      RESOURCE.APARTMENTS,
      RESOURCE_ACTION.SEE_RENTED_APARTMENTS,
    );
  }

  addRolesForUser(userId: number, role: ROLES) {
    return this.enforcer.addRoleForUser(userId?.toString(), role);
  }

  deleteRoleForUser(userId: number, role: ROLES) {
    return this.enforcer.deleteRoleForUser(userId?.toString(), role);
  }

  deleteRolesForUser(userId: number) {
    return this.enforcer.deleteRolesForUser(userId?.toString());
  }

  getRolesForUser(userId: number) {
    return this.enforcer
      .getRolesForUser(String(userId))
      .then((arr) => arr as ROLES[]);
  }

  async hasRolesForUser(userId: number, requiredRoles: ROLES[]) {
    const roles = await this.getRolesForUser(userId);
    return requiredRoles.every((role) => roles.includes(role));
  }

  isAdmin(userId: number) {
    return this.hasRolesForUser(userId, [ROLES.ADMIN]);
  }

  async addPermissionForUser(
    userId: number,
    resourceId: string,
    action: string,
  ) {
    await this.enforcer.addPermissionForUser(
      userId?.toString(),
      resourceId,
      action,
    );
  }

  async hasPermissionForUser(
    userId: number,
    resourceId: string,
    action: string,
  ) {
    return this.enforcer.hasPermissionForUser(
      userId?.toString(),
      resourceId,
      action,
    );
  }

  async hasImplicitPermissionForUser(
    userId: number,
    resourceId: string,
    action: string,
  ) {
    const permissions = await this.enforcer.getImplicitPermissionsForUser(
      userId?.toString(),
    );
    return permissions.some(
      ([__, pResourceId, pAction]) =>
        pResourceId === resourceId && pAction === action,
    );
  }
}
