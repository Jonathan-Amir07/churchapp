import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    // MOCK: Replace with actual email provider like SendGrid, AWS SES, or NodeMailer
    this.logger.log(
      `[MOCK EMAIL] Sending password reset to ${email}. Reset URL: ${resetUrl}`,
    );
    return true;
  }
}
