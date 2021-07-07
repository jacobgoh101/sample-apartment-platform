import { ENV } from '../../../config/env';
import * as connectSessionKnex from 'connect-session-knex';
import * as session from 'express-session';
import Knex from 'knex';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const KnexSessionStore = connectSessionKnex(session);

const knex = Knex({
  client: 'pg',
  connection: {
    host: ENV.DB_HOST,
    port: +ENV.DB_PORT,
    user: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  },
});

export const knexSessionStore = new KnexSessionStore({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  knex,
  tablename: 'sessions', // optional. Defaults to 'sessions'
});
