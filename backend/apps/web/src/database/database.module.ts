import { SessionModel } from '../../../../libs/account/src/auth/session.model';
import { EmailVerificationModel } from '../../../../libs/account/src/user/email-verification.model';
import { FailedLoginAttemptModel } from '../../../../libs/account/src/user/failed-login-attempts.model';
import { UserModel } from '../../../../libs/account/src/user/user.model';
import { ENV } from '../../../../libs/config/env';
import { Global, Module } from '@nestjs/common';
import Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';

const models = [
  UserModel,
  SessionModel,
  EmailVerificationModel,
  FailedLoginAttemptModel,
];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

export const knexInstance = Knex({
  client: 'pg',
  connection: {
    host: ENV.DB_HOST,
    port: +ENV.DB_PORT,
    user: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  },
  debug: process.env.KNEX_DEBUG === 'true',
  ...knexSnakeCaseMappers(),
  pool: { min: 0, max: 20 },
});

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      Model.knex(knexInstance);
      return knexInstance;
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
