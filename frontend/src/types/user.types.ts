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
}
