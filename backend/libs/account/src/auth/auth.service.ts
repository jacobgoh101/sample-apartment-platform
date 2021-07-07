import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { HttpService, Injectable } from '@nestjs/common';

export interface GoogleVerificationResult {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserModel | null> {
    const user = await this.usersService.findOneByEmail(email);
    const isValid = await user?.comparePassword(pass);
    if (isValid) {
      return user;
    }
    return null;
  }

  async validateGoogleAccessToken(
    accessToken: string,
  ): Promise<GoogleVerificationResult> {
    return this.httpService
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        params: {
          access_token: accessToken,
        },
      })
      .toPromise()
      .then(({ data }) => {
        return data;
      })
      .catch(() => null);
  }
}
