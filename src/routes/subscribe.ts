import { Router } from 'express';
import { SubscriberController } from '../controllers/subscriber.controller';

const router = Router();

// POST /api/subscribe
router.post('/subscribe', SubscriberController.subscribe);

export default router;
