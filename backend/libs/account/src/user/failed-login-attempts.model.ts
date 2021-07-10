import { BaseModel } from '../../../config/database/models/base.model';
import { UserModel } from './user.model';
import { Model } from 'objection';

export class FailedLoginAttemptModel extends BaseModel {
  static tableName = 'failed_login_attempts';

  userId: number;
  ipAddress: string;

  $formatJson(json) {
    json = super.$formatJson(json);
    json.createdAt = new Date(json.createdAt);
    json.updatedAt = new Date(json.updatedAt);
    return json;
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'failed_login_attempts.userId',
        to: 'users.id',
      },
    },
  };
}
