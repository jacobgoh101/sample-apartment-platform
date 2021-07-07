export enum CASBIN_PROVIDERS {
  CASBIN_ENFORCER = 'CASBIN_ENFORCER',
}

export enum ROLES {
  ADMIN = 'ADMIN',
  REALTOR = 'REALTOR',
}

export enum RESOURCE {}

export const getResourceId = (id: number, type: RESOURCE) => type + '_' + id;

export enum RESOURCE_ACTION {
  WRITE = 'WRITE',
}
