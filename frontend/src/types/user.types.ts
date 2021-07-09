export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  googleAccountId: boolean;
  facebookAccountId: boolean;
}

export interface SignupDto {
  name: string;
  password: string;
  email: string;
}

export type UpdateUserDto = SignupDto;
