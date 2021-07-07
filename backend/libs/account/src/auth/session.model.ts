import { BaseModel } from '../../../config/database/models/base.model';

export interface SessionPayload {
  cookie: Cookie;
  passport: Passport;
}

interface Cookie {
  originalMaxAge: number;
  expires: string;
  secure: boolean;
  httpOnly: boolean;
  path: string;
}

interface Passport {
  user: User;
}

interface User {
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}

export class SessionModel extends BaseModel {
  static tableName = 'sessions';

  expiredAt: Date;
  sid: string;
  sess: SessionPayload;

  $formatJson(json) {
    json = super.$formatJson(json);
    json.expiredAt = new Date(json.expiredAt);
    return json;
  }
}
