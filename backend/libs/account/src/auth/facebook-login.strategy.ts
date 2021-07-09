import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { FacebookLoginDto } from './facebook-login.dto';
import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class FacebookLoginStrategy extends PassportStrategy(
  Strategy,
  'facebook',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async validate(@Request() req): Promise<any> {
    const body: FacebookLoginDto = req.body;
    const { accessToken } = body;

    const verified = await this.authService.validateFacebookAccessToken(
      accessToken,
    );
    if (!verified) {
      throw new UnauthorizedException();
    }

    const { email, name } = verified;
    const user = await this.userService.upsertWithoutPassword({ email, name });
    return user;
  }
}
