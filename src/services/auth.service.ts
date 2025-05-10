import { prisma } from '../prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/otp.util';
import { sendOTPEmail } from '../utils/sendOtp.util';
import { RegisterDTO, VerifyOtpDTO, LoginDTO } from '../interface/auth.interface';
import { SetUsernameDTO } from '../interface/username.interface';
import { sendResetEmail } from '../utils/sendResetEmail.util';
import { generateResetToken } from '../utils/token.util';
import * as crypto from 'crypto';
import { createTokens } from './token.service';


const OTP_EXPIRY_MINUTES = 10;
// Constants controlling OTP resend policy
const MAX_RESENDS = 3; // maximum number of OTP resends
const RESEND_WINDOW_MINUTES = 10; // time window to enforce limit
export const registerUser = async (data: RegisterDTO) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  const otp = generateOTP();
  const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
  const now = new Date();
  const windowStart = new Date(now.getTime() - 10 * 60 * 1000); // 10 mins ago

  if (existing) {
    if (existing.isVerified) throw new Error('Email already in use');

    // Check if still in the same 10-minute window
    if (existing.otpSentWindowStart && existing.otpSentWindowStart > windowStart) {
      if (existing.otpSentCount >= 3) {
        throw new Error('You have reached the maximum OTP attempts. Try again later.');
      }

      // Increment the counter
      await prisma.user.update({
        where: { email: data.email },
        data: {
          otp,
          otpExpires: expires,
          otpSentCount: existing.otpSentCount + 1,
        },
      });
    } else {
      // Reset the window
      await prisma.user.update({
        where: { email: data.email },
        data: {
          otp,
          otpExpires: expires,
          otpSentCount: 1,
          otpSentWindowStart: now,
        },
      });
    }

    await sendOTPEmail(data.email, otp);
    return { message: 'OTP resent successfully' };
  }

  // Create a new user with initial OTP
  await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      contactNumber: data.contactNumber,
      schoolName: data.schoolName,
      roleInSchool: data.roleInSchool,
      studentSize: data.studentSize,
      otp,
      otpExpires: expires,
      isVerified: false,
      otpSentCount: 1,
      otpSentWindowStart: now,
    },
  });

  await sendOTPEmail(data.email, otp);
  return { message: 'OTP sent to email' };
};





/** 2. Verify OTP: mark user as verified */
export const verifyUserOtp = async ({ email, otp }: VerifyOtpDTO) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpires ||
    user.otpExpires < new Date()
  ) {
    throw new Error('Invalid or expired OTP');
  }

  await prisma.user.update({
    where: { email },
    data: { isVerified: true, otp: null, otpExpires: null },
  });
  return { message: 'Account verified' };
}

/** 3. Set Username & Password: update user with username and password */
export const setUser = async ({
  email,
  username,
  password,
  role,
}: SetUsernameDTO) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isVerified) {
    throw new Error('User not found or not verified');
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    throw new Error('Username already taken');
  }

  const hashed = await argon2.hash(password);

  await prisma.user.update({
    where: { email },
    data: {
      username, password: hashed,
      role: role ?? "TEACHER",
    },

  });

  return { message: 'Username and password set successfully' };
};
/** 4. Login: authenticate and return JWT */
export const loginUser = async ({ email, password, }: LoginDTO) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  if (!user.isVerified) throw new Error('Account not verified');
  if (!user.password) throw new Error('Password not set for this user');

  const valid = await argon2.verify(user.password, password);
  if (!valid) throw new Error('Invalid credentials');

  const { accessToken, refreshToken } = await createTokens({
    id: user.id,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken,
  };
};

/** Resend OTP to unverified user */
export const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('No user found with this email');
  if (user.isVerified) throw new Error('Account already verified');

  const now = new Date();
  const resendWindow = new Date(now.getTime() - RESEND_WINDOW_MINUTES * 60000);
  const resendCount = user.resendCount ?? 0;
  const lastUpdated = user.updatedAt;

  if (resendCount >= MAX_RESENDS && lastUpdated > resendWindow) {
    throw new Error('Maximum OTP resends reached. Try again later.');
  }

  const newOtp = generateOTP();
  const newExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  await prisma.user.update({
    where: { email },
    data: {
      otp: newOtp,
      otpExpires: newExpiry,
      resendCount: resendCount + 1,
    },
  });

  await sendOTPEmail(email, newOtp);
  return { message: 'A new OTP has been sent to your email.' };
};


export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const { token, hashed, expires } = generateResetToken();

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: hashed,
      resetTokenExpires: expires,
    },
  });

  await sendResetEmail(email, token); // Sends raw token
  return { message: 'Reset link sent to email' };
}

export async function resetPassword(token: string, newPassword: string) {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashed,
      resetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) throw new Error('Invalid or expired token');

  const hashedPassword = await argon2.hash(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  return { message: 'Password reset successful' };
}