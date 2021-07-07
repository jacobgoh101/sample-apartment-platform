import { RESOURCE_ACTION, RESOURCE } from './rbac.constant';
import { SetMetadata } from '@nestjs/common';

export interface Permission {
  action: RESOURCE_ACTION;
  resource: RESOURCE;
  resourceIdCallBack: (req) => number;
}

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
