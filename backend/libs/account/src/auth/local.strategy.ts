import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req, email: string, password: string): Promise<any> {
    const ipAddress = req.clientIp;
    const user = await this.authService.validateUser(
      email,
      password,
      ipAddress,
    );
    return user;
  }
}
