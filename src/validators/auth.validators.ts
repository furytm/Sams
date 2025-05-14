import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  contactNumber: z.string().min(7, 'Contact number is required'),
  schoolName: z.string().min(2, 'School name is required'),
  studentSize: z.preprocess(
    (val) => Number(val),
    z.number().int().positive('Student size must be a positive number')
  ),
});


export const registerWithTokenSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  contactNumber: z.string().min(7, 'Contact number is required'),
  token: z.string().length(5, 'Token must be 5 characters'), // adjust length if different
});


export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(4, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional().default(false),
});

