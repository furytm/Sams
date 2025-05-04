import {prisma} from '../prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/otp.util';
import { sendOTPEmail } from '../utils/sendOtp.util';
import { RegisterDTO, VerifyOtpDTO, LoginDTO } from '../interface/auth.interface';

const OTP_EXPIRY_MINUTES = 10;

export const AuthService = {
  async register(data: RegisterDTO) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already in use');

    const hashed = await argon2.hash(data.password);
    const otp = generateOTP();
    const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullname,
        email: data.email,
        contactNumber: data.contactNumber,
        schoolName: data.schoolName,
        roleInSchool: data.role,
        studentSize: data.studentSize,
        password: hashed,
        otp,
        otpExpires: expires,
        isVerified: false,
      },
    });

    await sendOTPEmail(data.email, otp);
    return { message: 'OTP sent to email' };
  },

  async verifyOtp({ email, otp }: VerifyOtpDTO) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      throw new Error('Invalid or expired OTP');
    }
    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpires: null },
    });
    return { message: 'Account verified' };
  },

  async login({ email, password }: LoginDTO) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Account not verified');
    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    return { token };
  },
};
