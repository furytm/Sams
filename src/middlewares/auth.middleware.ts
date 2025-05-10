// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../generated/prisma'; // only if you want to cast role precisely

export const authMiddleware = (req: Request, res: Response, next: NextFunction):void=> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch (err) {
  res.status(401).json({ error: 'Invalid or expired token' });
  }
};
