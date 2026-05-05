import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, template, context }: { 
  to: string, 
  subject: string, 
  template: string, 
  context: any 
}) {
  try {
    const templatePath = path.join(process.cwd(), 'templates', `${template}.ejs`);
    const html = (await ejs.renderFile(templatePath, context)) as string;

    await transporter.sendMail({
      from: `"Stable Partners" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    throw error; // Throw the error so the API route can catch it
  }
}
