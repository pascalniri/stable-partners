import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendThankYou(to: string, name: string) {
    try {
      const recipientName = name || 'Valued Client';
      await this.mailerService.sendMail({
        to,
        subject: 'Inquiry Received - Stable Partners',
        template: './thank-you',
        context: {
          name: recipientName,
        },
      });
      console.log(`✅ Thank you email sent to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send thank you email:', error.message);
    }
  }

  async sendLeadNotification(details: {
    name: string;
    email: string;
    serviceType: string;
    phone?: string;
    description?: string;
    propertyName?: string;
  }) {
    try {
      const ownerEmail = process.env.EMAIL_USER; // Send to owner
      await this.mailerService.sendMail({
        to: ownerEmail,
        subject: `NEW INQUIRY: ${details.name} - ${details.serviceType}`,
        template: './lead-notification',
        context: details,
      });
      console.log(`✅ Lead notification sent to ${ownerEmail}`);
    } catch (error) {
      console.error('❌ Failed to send lead notification:', error.message);
    }
  }

  async sendMeetingDetails(
    to: string,
    name: string,
    date: string,
    link: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Meeting Details - Stable Partners',
        template: './meeting-details',
        context: {
          name,
          date,
          link,
        },
      });
      console.log(`Meeting details email sent to ${to}`);
    } catch (error) {
      console.error('Error sending meeting details email:', error);
    }
  }
}
