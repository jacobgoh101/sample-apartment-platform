import { FailedLoginAttemptModel } from '../user/failed-login-attempts.model';
import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import {
  ForbiddenException,
  HttpService,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ModelClass } from 'objection';

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

export interface FacebookVerificationResult {
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    @Inject('FailedLoginAttemptModel')
    private readonly failedLoginAttemptModel: ModelClass<FailedLoginAttemptModel>,
  ) {}

  async validateUser(
    email: string,
    pass: string,
    ipAddress: string,
  ): Promise<UserModel | null> {
    const user = await this.userService.findOneNonSocialUserByEmail(email);
    if (user.blocked) {
      throw new ForbiddenException(
        'Your account has been temporary suspended due to suspicious activity. Please contact support@apartmentrental.com ',
      );
    }
    const isValid = await user?.comparePassword(pass);
    if (isValid) {
      if (!user.emailVerified) {
        this.userService.createAndSendEmailVerification(user);
        throw new ForbiddenException('Please verify your email address');
      }
      return user;
    }
    await this.logLoginFailedAttempt(user, ipAddress);
    await this.blockUserIfNeeded(user);
    throw new UnauthorizedException();
  }

  async logLoginFailedAttempt(user: UserModel, ipAddress: string) {
    await this.failedLoginAttemptModel
      .query()
      .insert({
        userId: user?.id,
        ipAddress,
      })
      .returning('*');
  }

  async blockUserIfNeeded(user: UserModel) {
    const failedAttemptCount = await this.failedLoginAttemptModel
      .query()
      .where('userId', user?.id)
      // failed attempts within the past 5 minutes
      .where('createdAt', '>', dayjs().subtract(5, 'minute').toDate())
      .resultSize();
    const shouldBlock = failedAttemptCount >= 3;
    if (shouldBlock) {
      return await this.userService.blockUser(user?.id);
    }
    return user;
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

  async validateFacebookAccessToken(
    accessToken: string,
  ): Promise<FacebookVerificationResult> {
    return this.httpService
      .get(`https://graph.facebook.com/v2.9/me`, {
        params: {
          fields: 'email,first_name,last_name,name,timezone,verified',
          access_token: accessToken,
          suppress_response_codes: true,
        },
      })
      .toPromise()
      .then(({ data }) => {
        return data;
      })
      .catch(() => null);
  }
}
