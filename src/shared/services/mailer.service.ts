import { Injectable } from '@nestjs/common';
import sgMail = require("@sendgrid/mail");

@Injectable()
export class MailerService {

  async sendMail(to: string[], subject: string, text: string): Promise<void> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to, subject, text,
      from: process.env.SENDGRID_SENDER_EMAIL,
    };
    sgMail.send(msg);
  }
}
