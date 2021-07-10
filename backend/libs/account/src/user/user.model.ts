import { BaseModel } from '../../../config/database/models/base.model';
import { BCRYPT } from '../../../util/bcrypt.util';
import { EmailVerificationModel } from './email-verification.model';
import { FailedLoginAttemptModel } from './failed-login-attempts.model';
import { Model } from 'objection';

export class UserModel extends BaseModel {
  static tableName = 'users';

  email: string;
  passwordHash: string;
  name: string;
  googleAccountId?: string;
  facebookAccountId?: string;
  emailVerified: boolean;
  blocked: boolean;

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.passwordHash;
    json.createdAt = new Date(json.createdAt);
    json.updatedAt = new Date(json.updatedAt);
    return json;
  }

  async comparePassword(password: string) {
    return BCRYPT.comparePassword(password, this.passwordHash);
  }

  static relationMappings = {
    emailVerifications: {
      relation: Model.HasManyRelation,
      modelClass: EmailVerificationModel,
      join: {
        from: 'users.id',
        to: 'email_verifications.userId',
      },
    },
    failedLoginAttempts: {
      relation: Model.HasManyRelation,
      modelClass: FailedLoginAttemptModel,
      join: {
        from: 'users.id',
        to: 'failed_login_attempts.userId',
      },
    },
  };
}
