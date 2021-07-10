import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { FacebookLoginDto } from './facebook-login.dto';
import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class FacebookLoginStrategy extends PassportStrategy(
  Strategy,
  'facebook-login',
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

    const { id, name, email } = verified;
    let user = await this.userService.findByFacebook(id);
    if (!user) {
      // auto sign up
      user = await this.userService.createByFacebook({
        email,
        name,
        facebookAccountId: id,
      });
    }
    return user;
  }
}
