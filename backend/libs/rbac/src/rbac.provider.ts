import { knexInstance } from '../../../apps/web/src/database/database.module';
import { CASBIN_PROVIDERS } from './rbac.constant';
import { ObjectionAdapter } from '@willsoto/casbin-objection-adapter';
import { newEnforcer } from 'casbin';

export const casbinProviders = [
  {
    provide: CASBIN_PROVIDERS.CASBIN_ENFORCER,
    useFactory: async () => {
      const adapter = await ObjectionAdapter.newAdapter(knexInstance, {
        createTable: true,
      });

      return newEnforcer(
        __dirname + `/../../../libs/rbac/src/rbac_model.conf`,
        adapter,
      );
    },
  },
];
