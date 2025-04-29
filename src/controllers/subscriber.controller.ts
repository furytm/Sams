import { Request, Response } from 'express';
import { SubscriberService } from '../services/subscriber.service';


export const SubscriberController = {
  async subscribe(req: Request, res: Response):Promise<void> {
    const { email } = req.body;

    if (!email) {
  res.status(400).json({ error: 'Email is required.' });
    }

    try {
      const subscriber = await SubscriberService.subscribe(email);

  res.status(201).json({
        message: 'Successfully subscribed!',
        subscriber,
      });
    } catch (error: any) {
      console.error('Error subscribing:', error.message);

      if (error.message === 'Email already subscribed') {
         res.status(409).json({ error: error.message });
      }

    res.status(500).json({ error: 'Internal server error.' });
    }
  }
};
