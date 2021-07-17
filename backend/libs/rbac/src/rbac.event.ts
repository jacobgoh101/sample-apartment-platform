import { USER_EVENT } from '../../account/src/user/user.constant';
import { CreateUserDto, UpdateUserDto } from '../../account/src/user/user.dto';
import { UserModel } from '../../account/src/user/user.model';
import {
  getResourceId,
  RESOURCE,
  ROLES,
  RESOURCE_ACTION,
} from './rbac.constant';
import { RbacService } from './rbac.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { difference } from 'lodash';

@Injectable()
export class RbacEventHandler {
  constructor(private readonly rbacService: RbacService) {}

  @OnEvent(USER_EVENT.SIGNUP)
  async handleUserSignupEvent({ user }: { user: UserModel }) {
    await this.rbacService.addRolesForUser(user?.id, ROLES.CLIENT);
  }

  @OnEvent(USER_EVENT.UPDATE)
  async handleUserUpdateEvent(body: UpdateUserDto & { id: number }) {
    const id = body.id;
    if (body.roles) {
      const existingRoles = await this.rbacService.getRolesForUser(id);
      const newRoles = body.roles;

      const rolesToBeAdded = difference<ROLES>(newRoles, existingRoles);
      const rolesToBeDeleted = difference<ROLES>(existingRoles, newRoles);

      await Promise.all([
        ...rolesToBeAdded.map((role) =>
          this.rbacService.addRolesForUser(id, role),
        ),
        ...rolesToBeDeleted.map((role) =>
          this.rbacService.deleteRoleForUser(id, role),
        ),
      ]);
    }
  }

  @OnEvent(USER_EVENT.CREATE)
  async handleUserCreatedByAdminEvent(body: CreateUserDto & { id: number }) {
    const id = body.id;
    if (body.roles) {
      const rolesToBeAdded = body.roles;

      await Promise.all([
        ...rolesToBeAdded.map((role) =>
          this.rbacService.addRolesForUser(id, role),
        ),
      ]);
    }
  }

  @OnEvent(USER_EVENT.DELETE)
  async handleUserDeleteEvent(id: number) {
    await this.rbacService.deleteRolesForUser(id);
  }
}
