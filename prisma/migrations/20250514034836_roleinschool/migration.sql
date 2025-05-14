/*
  Warnings:

  - Made the column `schoolId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roleInSchool" DROP NOT NULL,
ALTER COLUMN "schoolId" SET NOT NULL;
