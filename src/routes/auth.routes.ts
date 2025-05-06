import { Router } from 'express';
import { register, verifyOtp, login, setUsernameAndPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/username',  setUsernameAndPassword);
router.post('/login',  login);

export default router;
