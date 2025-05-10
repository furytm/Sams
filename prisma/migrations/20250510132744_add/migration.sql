-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpSentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otpSentWindowStart" TIMESTAMP(3);
