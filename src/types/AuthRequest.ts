// types/AuthRequest.ts
import { Request } from 'express';
import { UserRole } from '../generated/prisma';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}
