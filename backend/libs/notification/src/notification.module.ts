import { emailProviders } from './email/email.provider';
import { EmailService } from './email/email.service';
import { NotificationService } from './notification.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [NotificationService, ...emailProviders, EmailService],
  exports: [NotificationService, EmailService],
})
export class NotificationModule {}
