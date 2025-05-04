import { transporter } from '../config/nodemailer.config';

const sendOTPEmail = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<p>Hello,</p><p>Your OTP code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
    });
    console.log('OTP Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP');
  }
};

export { sendOTPEmail };
