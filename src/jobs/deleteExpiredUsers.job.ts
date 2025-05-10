import cron from 'node-cron';
import { prisma } from '../prisma/client';

export function scheduleUserCleanup() {
  console.log('🟢 User cleanup cron job initialized (runs every 5 minutes)');

  cron.schedule('*/5 * * * *', async () => {
    const timestamp = new Date().toISOString();
    console.log(`🔄 [${timestamp}] Running user cleanup job...`);

    try {
      const result = await prisma.user.deleteMany({
        where: {
          isVerified: false,
          otpExpires: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        console.log(`✅ [${timestamp}] Deleted ${result.count} unverified users`);
      } else {
        console.log(`ℹ️  [${timestamp}] No unverified users to delete`);
      }
    } catch (err) {
      console.error(`❌ [${timestamp}] Error during user cleanup:`, err);
    }
  });
}
