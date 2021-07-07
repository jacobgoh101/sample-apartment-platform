import { knexSessionStore } from '../../../libs/account/src/auth/knex-session-store';
import { ENV } from '../../../libs/config/env';
import { DATE_TIME } from '../../../libs/util/date-time.util';
import { WebModule } from './web.module';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(WebModule);

  app.use(helmet());
  app.enableCors({
    origin: [ENV.FRONTEND_HOSTNAME],
    credentials: true,
  });

  app.setGlobalPrefix('api-v1');

  app.use(
    session({
      secret: ENV.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: 'review.sid',
      cookie: {
        httpOnly: true,
        maxAge: DATE_TIME.ONE_DAY_IN_MILLISECONDS,
        secure: !ENV.isDev,
      },
      store: knexSessionStore,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(ENV.BACKEND_PORT_NUMBER);
}
bootstrap();
