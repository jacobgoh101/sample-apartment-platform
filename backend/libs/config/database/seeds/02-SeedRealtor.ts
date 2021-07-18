import { UserModel } from '../../../account/src/user/user.model';
import { ROLES } from '../../../rbac/src/rbac.constant';
import { BCRYPT } from '../../../util/bcrypt.util';
import { CasbinRule } from '@willsoto/casbin-objection-adapter';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<any> {
  const userModel = () => knex(UserModel.tableName);
  const casbinRuleModel = () => knex(CasbinRule.tableName);
  await addRealtor(
    'jacobgoh101+seeded-realtor-1@gmail.com',
    'Seeded Realtor 1',
  );
  await addRealtor(
    'jacobgoh101+seeded-realtor-2@gmail.com',
    'Seeded Realtor 2',
  );

  async function addRealtor(email: string, name: string) {
    let user = await userModel().where('email', email).first();
    if (!user)
      try {
        await userModel().insert({
          email,
          passwordHash: BCRYPT.hashPasswordSync('Pa$$w0rd!'),
          name,
          emailVerified: true,
          blocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        user = await userModel().where('email', email).first();
      } catch (error) {}
    const realtorCasbinQuery = {
      ptype: 'g',
      v0: `${user.id}`,
      v1: ROLES.REALTOR,
    };
    const ruleExists = await casbinRuleModel()
      .where(realtorCasbinQuery)
      .first();
    !ruleExists && (await casbinRuleModel().insert(realtorCasbinQuery));
    return user;
  }
}
