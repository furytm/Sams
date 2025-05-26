import { prisma } from '../prisma/client';
import { UserRole } from '../generated/prisma';

export const getUsersByRole = async (schoolId: string, role: UserRole) => {
  return prisma.user.findMany({
    where: {
      schoolId,
      role,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      contactNumber: true,
      username: true,
      createdAt: true,
      schoolName: true,   
      schoolId: true,    
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllUsersBySchool = async (schoolId: string) => {
  return prisma.user.findMany({
    where: { schoolId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      contactNumber: true,
      username: true,
      createdAt: true,
      schoolName: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};
