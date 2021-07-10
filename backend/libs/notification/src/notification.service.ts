import { EmailService } from './email/email.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private readonly emailService: EmailService) {}

  async sendEmailVerification({
    name,
    email,
    verificationUrl,
  }: {
    name: string;
    email: string;
    verificationUrl: string;
  }) {
    await this.emailService.send({
      to: email,
      subject: 'Please verify your email for Apartment Platform',
      html: `
        Hi ${name},

        <br>
        <br>

        We just need to verify your email address before you can access Apartment Platform.

        <br>
        <br>
        
        Verify your email address <a href="${verificationUrl}">${verificationUrl}</a>

        <br>
        <br>
        <br>
        <br>
        
        Thanks! &#8211; The Apartment Platform team
      `,
    });
  }
}
