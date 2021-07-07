import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './google-login.dto';
import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(Strategy, 'google') {
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

    const { email, name } = verified;
    const user = await this.userService.upsertWithoutPassword({ email, name });
    return user;
  }
}
