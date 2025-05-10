import { UserRole } from '../generated/prisma';

// ✅ src/types/express.d.ts
import { UserRole } from '../generated/prisma'; // your custom path

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}
export {};
