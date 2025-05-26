import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { getStudents, getTeachers, getParents } from '../controllers/user.controller';

import { getAllUsersController } from '../controllers/user.controller';
const router = Router();

// Must be ADMIN to fetch school users
router.get('/students', authMiddleware, requireRole(['ADMIN']), getStudents);
router.get('/teachers', authMiddleware, requireRole(['ADMIN']), getTeachers);
router.get('/parents', authMiddleware, requireRole(['ADMIN']), getParents);
router.get('/users', authMiddleware, getAllUsersController);

export default router;
