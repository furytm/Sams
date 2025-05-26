import { Request, Response } from 'express';
import { getUsersByRole } from '../services/user.service';
import { UserRole } from '../generated/prisma';
import { getAllUsersBySchool } from '../services/user.service';
export const getStudents = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if(!schoolId){
        throw new Error("Invalid school ID")
    }
    const students = await getUsersByRole(schoolId, UserRole.STUDENT);
    res.json(students);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
        if(!schoolId){
        throw new Error("Invalid school ID")
    }
    const teachers = await getUsersByRole(schoolId, UserRole.TEACHER);
    res.json(teachers);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getParents = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
        if(!schoolId){
        throw new Error("Invalid school ID")
    }
    const parents = await getUsersByRole(schoolId, UserRole.PARENT);
    res.json(parents);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};




export const getAllUsersController = async (req: Request, res: Response):Promise<void> => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
   res.status(400).json({ error: 'Missing schoolId from token' });
   return;
    }

    const users = await getAllUsersBySchool(schoolId);
    res.status(200).json(users);
  } catch (err: any) {
    console.error('Error fetching all users:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

