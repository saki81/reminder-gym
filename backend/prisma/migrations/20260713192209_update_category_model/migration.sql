/*
  Warnings:

  - You are about to drop the column `isDefault` on the `Category` table. All the data in the column will be lost.
  - Made the column `gymId` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Category_name_gymId_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "isDefault",
ALTER COLUMN "gymId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Category_gymId_idx" ON "Category"("gymId");
