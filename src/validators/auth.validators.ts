import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(4, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional().default(false),
});
