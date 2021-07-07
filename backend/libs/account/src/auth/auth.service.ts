import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(email: string, pass: string): Promise<UserModel | null> {
    const user = await this.usersService.findOneByEmail(email);
    const isValid = await user?.comparePassword(pass);
    if (isValid) {
      return user;
    }
    return null;
  }
}
