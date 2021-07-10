import { ENV } from '../../../config/env';
import { EMAIL_PROVIDERS } from './email.constant';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { retry } from 'async-retry-decorator';
import { messages, Mailgun } from 'mailgun-js';

@Injectable()
export class EmailService {
  constructor(
    @Inject(EMAIL_PROVIDERS.MAILGUN)
    private readonly mailgun: Mailgun,
  ) {}

  @retry({
    onRetry: (error, attempt) => {
      Logger.log(
        `Retry (${attempt}) on error. EmailService.send`,
        error.message,
      );
    },
  })
  async send(data: Partial<messages.SendData>) {
    const { from = `no-reply@${ENV.MAILGUN_DOMAIN}` } = data;
    Logger.log({ ...data }, 'EmailService.send');
    await this.mailgun.messages().send({ from, ...data } as messages.SendData);
  }
}
