import {prisma} from '../prisma/client';

export const SubscriberService = {
  async subscribe(email: string) {
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      throw new Error('Email already subscribed');
    }

    const newSubscriber = await prisma.subscriber.create({
      data: { email },
    });

    return newSubscriber;
  }
};
