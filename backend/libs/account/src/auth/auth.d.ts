import { UserModel } from '../user/user.model';

declare module 'express' {
  export interface Request {
    user?: UserModel;
  }
}
