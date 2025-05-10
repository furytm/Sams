// utils/sendResetEmail.util.ts
import { transporter } from '../config/nodemailer.config';

export async function sendResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your password',
    text: `Click to reset your password: ${resetUrl}`,
  });
}
