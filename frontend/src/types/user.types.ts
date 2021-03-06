import { ROLES } from './roles.types';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  blocked: boolean;
  googleAccountId: boolean;
  facebookAccountId: boolean;
  roles?: ROLES[];
}

export interface SignupDto {
  name: string;
  password: string;
  email: string;
}

export interface UpdateUserDto {
  name: string;
  password?: string;
  email: string;
  blocked: boolean;
  emailVerified: boolean;
  roles: ROLES[];
}
export interface CreateUserDto {
  name: string;
  password: string;
  email: string;
  blocked: boolean;
  emailVerified: boolean;
  roles: ROLES[];
}
