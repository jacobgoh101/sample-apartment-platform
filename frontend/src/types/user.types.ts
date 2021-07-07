export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupDto {
  name: string;
  password: string;
  email: string;
}

export type UpdateUserDto = SignupDto;
