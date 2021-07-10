import { BaseModel } from '../../../config/database/models/base.model';
import { UserModel } from './user.model';
import { Model } from 'objection';

export class EmailVerificationModel extends BaseModel {
  static tableName = 'email_verifications';

  email: string;
  userId: number;
  expiredAt: Date;
  verifiedAt: Date;
  token: string;

  $formatJson(json) {
    json = super.$formatJson(json);
    json.createdAt = new Date(json.createdAt);
    json.updatedAt = new Date(json.updatedAt);
    json.expiredAt = new Date(json.expiredAt);
    json.verifiedAt = json.verifiedAt && new Date(json.verifiedAt);
    return json;
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'email_verifications.userId',
        to: 'users.id',
      },
    },
  };
}
