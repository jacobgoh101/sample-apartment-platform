import { BaseModel } from '../../../config/database/models/base.model';
import { ROLES } from '../../../rbac/src/rbac.constant';
import { BCRYPT } from '../../../util/bcrypt.util';
import { EmailVerificationModel } from './email-verification.model';
import { FailedLoginAttemptModel } from './failed-login-attempts.model';
import { CasbinRule } from '@willsoto/casbin-objection-adapter';
import { Model, ref } from 'objection';

export class UserModel extends BaseModel {
  static tableName = 'users';

  email: string;
  passwordHash: string;
  name: string;
  googleAccountId?: string;
  facebookAccountId?: string;
  emailVerified: boolean;
  blocked: boolean;
  roles?: ROLES[];

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.passwordHash;
    json.createdAt = new Date(json.createdAt);
    json.updatedAt = new Date(json.updatedAt);
    if (Array.isArray(json.roles)) {
      json.roles = json.roles.map((casbinRule: CasbinRule) => casbinRule.v1);
    }
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
    roles: {
      relation: Model.HasManyRelation,
      modelClass: CasbinRule,
      join: {
        from: ref('users.id').castText(),
        to: `${CasbinRule.tableName}.v0`,
        filter(builder) {
          builder.where('ptype', 'g').whereIn('v1', Object.values(ROLES));
        },
      },
    },
  };
}
