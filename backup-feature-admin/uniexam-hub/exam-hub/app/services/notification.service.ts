import nodemailer, { type Transporter } from 'nodemailer';
import { logger } from '../lib/logger.server';

class NotificationService {
  private transporter: Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass },
      });
    } else {
      logger.warn('SMTP credentials not configured. Notifications will be logged instead of sent.');
    }
  }

  /**
   * Send an email notification
   */
  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.transporter) {
      logger.info(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"UniExam Hub" <noreply@uniexamhub.com>',
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      logger.error({ err: error }, 'Failed to send email:');
      return false;
    }
  }

  /**
   * Send purchase confirmation
   */
  async sendPurchaseConfirmation(email: string, sheetTitle: string): Promise<void> {
    const subject = `Your purchase of ${sheetTitle} is confirmed!`;
    const html = `
      <h1>Thank you for your purchase!</h1>
      <p>We've received your payment and your access to <strong>${sheetTitle}</strong> has been granted.</p>
      <p>Log in to your account and go to your dashboard to start practicing.</p>
    `;
    await this.sendEmail(email, subject, html);
  }

  /**
   * Send purchase rejection
   */
  async sendPurchaseRejection(email: string, sheetTitle: string, reason: string): Promise<void> {
    const subject = `Update on your purchase of ${sheetTitle}`;
    const html = `
      <h1>Payment Verification Update</h1>
      <p>We were unable to verify your payment for <strong>${sheetTitle}</strong>.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please try again or contact support if you believe this is an error.</p>
    `;
    await this.sendEmail(email, subject, html);
  }

  /**
   * Send Mock SMS/Telegram notification (Placeholders for actual APIs)
   */
  async sendSMS(phone: string, message: string): Promise<void> {
    logger.info(`[MOCK SMS] To: ${phone} | Message: ${message}`);
    // Implement Twilio / local SMS API integration here
  }
}

export const notificationService = new NotificationService();
