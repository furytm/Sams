import { UserRole } from '../generated/prisma';
import { Request, Response, NextFunction } from 'express';


export const requireRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction):void => {
      const user = req.user; // assuming you've added the user in auth middleware
      if (!user || !roles.includes(user.role)) {
       res.status(403).json({ error: "Access denied" });
       return;
      }
      next();
    };
  };
  