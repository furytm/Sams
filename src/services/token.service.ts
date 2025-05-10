import { prisma } from '../prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const REFRESH_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createTokens(user: { id: string, role: string }) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const hashed = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

  await prisma.refreshToken.create({
    data: {
      token: hashed,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_IN),
    },
  });

  return { accessToken, refreshToken: rawRefreshToken };
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
