import * as bcrypt from 'bcryptjs';

const SALT_ROUND = 12;

export class BCRYPT {
  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUND);
  }

  static hashPasswordSync(password: string): string {
    return bcrypt.hashSync(password, SALT_ROUND);
  }

  static comparePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  static comparePasswordSync(password: string, passwordHash: string) {
    return bcrypt.compareSync(password, passwordHash);
  }
}
