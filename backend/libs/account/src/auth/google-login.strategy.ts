import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './google-login.dto';
import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(
  Strategy,
  'google-login',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async validate(@Request() req): Promise<any> {
    const body: GoogleLoginDto = req.body;
    const { accessToken } = body;

    const verified = await this.authService.validateGoogleAccessToken(
      accessToken,
    );
    if (!verified) {
      throw new UnauthorizedException();
    }

    const { sub, name, email } = verified;
    let user = await this.userService.findByGoogle(sub);
    if (!user) {
      // auto sign up
      user = await this.userService.createByGoogle({
        email,
        name,
        googleAccountId: sub,
      });
    }
    return user;
  }
}
