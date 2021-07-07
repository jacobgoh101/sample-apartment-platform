/* eslint-disable @typescript-eslint/ban-types */
import { BCRYPT } from '../../../util/bcrypt.util';
import { SignUpDto } from './user.dto';
import { UserModel } from './user.model';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const mockSignUpDto: SignUpDto = {
  email: `example${+new Date()}@test.com`,
  password: 'password',
  name: 'Mock User Name',
};

export const mockUser: Partial<UserModel> = {
  ...mockSignUpDto,
  id: 1,
  passwordHash: BCRYPT.hashPasswordSync('password'),
  createdAt: new Date(),
  updatedAt: new Date(),
  comparePassword(password: string) {
    return BCRYPT.comparePassword(password, this.passwordHash);
  },
};
