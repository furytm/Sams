
import {Router} from 'express'
import { generateParentToken, generateStudentToken, generateTeacherToken } from '../controllers/token.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router()


router.post('/generate-student', authMiddleware, requireRole(['ADMIN']), generateStudentToken);
router.post('/generate-teacher', authMiddleware, requireRole(['ADMIN']), generateTeacherToken);
router.post('/generate-parent', authMiddleware, requireRole(['ADMIN']), generateParentToken);



export default router