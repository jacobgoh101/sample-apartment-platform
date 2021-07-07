import { BaseModel } from '../../../config/database/models/base.model';
import { BCRYPT } from '../../../util/bcrypt.util';

export class UserModel extends BaseModel {
  static tableName = 'users';

  email: string;
  passwordHash: string;
  name: string;

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.passwordHash;
    json.createdAt = new Date(json.createdAt);
    json.updatedAt = new Date(json.updatedAt);
    return json;
  }

  async comparePassword(password: string) {
    console.log(password, this.passwordHash);

    return BCRYPT.comparePassword(password, this.passwordHash);
  }
}
