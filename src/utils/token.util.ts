// utils/token.util.ts
import * as crypto from 'crypto';


export function generateResetToken(): { token: string; hashed: string; expires: Date } {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 min
  return { token, hashed, expires };
}
