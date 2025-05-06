import {prisma} from '../prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/otp.util';
import { sendOTPEmail } from '../utils/sendOtp.util';
import { RegisterDTO, VerifyOtpDTO, LoginDTO } from '../interface/auth.interface';
import { SetUsernameDTO } from '../interface/username.interface';

const OTP_EXPIRY_MINUTES = 10;
/** 1. Register: create a user with OTP */
export const registerUser = async (data: RegisterDTO) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already in use');

  // Generate OTP
  const otp = generateOTP();
  const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

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
    },
  });

  await sendOTPEmail(data.email, otp);
  return { message: 'OTP sent to email' };
};


/** 2. Verify OTP: mark user as verified */
export const verifyUserOtp= async({ email, otp }: VerifyOtpDTO) =>{
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
export const setUser= async ({
  email,
  username,
  password,
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
    data: { username, password: hashed },
  });

  return { message: 'Username and password set successfully' };
};
/** 4. Login: authenticate and return JWT */
export const loginUser= async({ email, password }: LoginDTO) =>{
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  if (!user.isVerified) throw new Error('Account not verified');
 if(!user.password){
  throw new Error('Password not set for this user')
 }
  const valid = await argon2.verify(user.password, password);
  if (!valid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
  return { token };
}