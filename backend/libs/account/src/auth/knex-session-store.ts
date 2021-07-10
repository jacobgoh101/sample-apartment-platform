import { knexInstance } from '../../../../apps/web/src/database/database.module';
import * as connectSessionKnex from 'connect-session-knex';
import * as session from 'express-session';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const KnexSessionStore = connectSessionKnex(session);

export const knexSessionStore = new KnexSessionStore({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  knex: knexInstance,
  tablename: 'sessions', // optional. Defaults to 'sessions'
});
