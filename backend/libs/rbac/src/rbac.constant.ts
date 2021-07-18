export enum CASBIN_PROVIDERS {
  CASBIN_ENFORCER = 'CASBIN_ENFORCER',
}

export enum ROLES {
  ADMIN = 'ADMIN',
  REALTOR = 'REALTOR',
  CLIENT = 'CLIENT',
}

export enum RESOURCE {
  APARTMENTS = 'APARTMENTS',
}

export const getResourceId = (id: number, type: RESOURCE) => type + '_' + id;

export enum RESOURCE_ACTION {
  WRITE = 'WRITE',
  SEE_RENTED_APARTMENTS = 'SEE_RENTED_APARTMENTS',
}
