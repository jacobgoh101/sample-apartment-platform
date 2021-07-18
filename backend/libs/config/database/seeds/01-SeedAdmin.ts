import { UserModel } from '../../../account/src/user/user.model';
import { BCRYPT } from '../../../util/bcrypt.util';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<any> {
  const userModel = () => knex<UserModel>(UserModel.tableName);
  await userModel()
    .insert({
      email: 'jacobgoh101@gmail.com',
      passwordHash: BCRYPT.hashPasswordSync('Pa$$w0rd!'),
      name: 'The Admin',
      emailVerified: true,
      blocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .catch(() => null);
}
