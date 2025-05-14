import { prisma } from '../prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserRole } from '../generated/prisma';  // enum: STUDENT, TEACHER, PARENT
import { TokenPayload } from 'src/interface/token.interface';
const REFRESH_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000; // 30 days


export async function createTokens({ id, role, schoolId }: TokenPayload) {
  const accessToken = jwt.sign(
    { userId: id, role, schoolId },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );

  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const hashed = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

  await prisma.refreshToken.create({
    data: {
      token: hashed,
      userId: id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_IN),
    },
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
  };
}

export async function rotateRefreshToken(rawToken: string) {
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

  const tokenRecord = await prisma.refreshToken.findFirst({
    where: {
      token: hashed,
      revoked: false,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!tokenRecord || !tokenRecord.user) throw new Error('Invalid refresh token');

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { revoked: true },
  });

  return createTokens(tokenRecord.user);
}

export async function revokeToken(rawToken: string) {
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
  await prisma.refreshToken.updateMany({
    where: { token: hashed },
    data: { revoked: true },
  });
}

export async function revokeAllUserTokens(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}



const generateToken = (length = 5): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const generateRoleToken = async (schoolId: string, role: UserRole) => {

  const token = generateToken();

  // Remove old token for this role+school
  await prisma.token.deleteMany({
    where: { schoolId, role },
  });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const newToken = await prisma.token.create({
    data: {
      token,
      role,
      schoolId,
      expiresAt,
    },
  });

  return newToken;
};
