import { ENV } from './libs/config/env';
import { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: ENV.DB_HOST,
    port: +ENV.DB_PORT,
    user: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  },
  migrations: {
    directory: './libs/config/database/migrations',
    stub: './libs/config/database/migration.stub',
  },
  seeds: {
    directory: './libs/config/database/seeds',
    stub: './libs/config/database/seed.stub',
  },
  debug: true,
  ...knexSnakeCaseMappers(),
};
module.exports = config;
