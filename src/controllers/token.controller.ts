// controllers/token.controller.ts
import { Request, Response } from 'express';
import { generateRoleToken } from '../services/token.service';
import { UserRole } from '../generated/prisma'; // or '@prisma/client' if you're not using a custom output path


export const generateStudentToken = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
      if(!schoolId){
    throw  new Error("Missing school id in user Payload")
  }
    const token = await generateRoleToken(schoolId, UserRole.STUDENT);
    res.json({ token: token.token, expiresAt: token.expiresAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const generateTeacherToken = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
      if(!schoolId){
    throw  new Error("Missing school id in user Payload")
  }
    const token = await generateRoleToken(schoolId, UserRole.TEACHER);
    res.json({ token: token.token, expiresAt: token.expiresAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const generateParentToken = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
      if(!schoolId){
    throw  new Error("Missing school id in user Payload")
  }
    const token = await generateRoleToken(schoolId, UserRole.PARENT);
    res.json({ token: token.token, expiresAt: token.expiresAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
