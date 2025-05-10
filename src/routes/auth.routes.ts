import { Router } from 'express';
import { register, verifyOtp, login, setUsernameAndPassword, forgotPassword, handlePasswordReset, resendOtpController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/username',  setUsernameAndPassword);
router.post('/login',  login);
// routes/auth.routes.ts
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', handlePasswordReset);
router.post('/resend-otp', resendOtpController);

router.get('/admin-only', authMiddleware, requireRole(['ADMIN']), (req, res) => {
  res.json({ message: `Hello Admin ${req.user?.userId}` });
});


router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, user ${req.user?.userId}` });
});


export default router;
