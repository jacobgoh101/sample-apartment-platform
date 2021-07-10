import { ENV } from '../../../config/env';
import { EMAIL_PROVIDERS } from './email.constant';
import * as mailgun from 'mailgun-js';

export const emailProviders = [
  {
    provide: EMAIL_PROVIDERS.MAILGUN,
    useFactory: async () => {
      const domain = ENV.MAILGUN_DOMAIN;
      const mg = mailgun({ apiKey: ENV.MAILGUN_API_KEY, domain });
      return mg;
    },
  },
];
