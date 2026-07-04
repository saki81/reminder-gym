/*
  Warnings:

  - You are about to drop the column `gymId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gymId_fkey";

-- DropIndex
DROP INDEX "User_gymId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gymId",
ADD COLUMN     "activeGymId" TEXT;

-- CreateIndex
CREATE INDEX "User_activeGymId_idx" ON "User"("activeGymId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeGymId_fkey" FOREIGN KEY ("activeGymId") REFERENCES "Gym"("id") ON DELETE SET NULL ON UPDATE CASCADE;
