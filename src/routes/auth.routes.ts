import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/login',      AuthController.login);

export default router;
