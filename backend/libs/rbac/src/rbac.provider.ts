import { ENV } from '../../config/env';
import { CASBIN_PROVIDERS } from './rbac.constant';
import { ObjectionAdapter } from '@willsoto/casbin-objection-adapter';
import { newEnforcer } from 'casbin';
import Knex from 'knex';

export const casbinProviders = [
  {
    provide: CASBIN_PROVIDERS.CASBIN_ENFORCER,
    useFactory: async () => {
      console.log({
        client: 'pg',
        connection: {
          host: ENV.DB_HOST,
          port: +ENV.DB_PORT,
          user: ENV.DB_USERNAME,
          password: ENV.DB_PASSWORD,
          database: ENV.DB_NAME,
        },
        debug: process.env.KNEX_DEBUG === 'true',
      });

      const knex = Knex({
        client: 'pg',
        connection: {
          host: ENV.DB_HOST,
          port: +ENV.DB_PORT,
          user: ENV.DB_USERNAME,
          password: ENV.DB_PASSWORD,
          database: ENV.DB_NAME,
        },
        debug: process.env.KNEX_DEBUG === 'true',
      });
      const adapter = await ObjectionAdapter.newAdapter(knex, {
        createTable: true,
      });

      return newEnforcer(
        __dirname + `/../../../libs/rbac/src/rbac_model.conf`,
        adapter,
      );
    },
  },
];
