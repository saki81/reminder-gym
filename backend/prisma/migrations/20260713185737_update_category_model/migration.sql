/*
  Warnings:

  - A unique constraint covering the columns `[gymId,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gymId,inventoryNumber]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "inventoryNumber" TEXT,
ADD COLUMN     "serialNumber" TEXT,
ADD COLUMN     "serviceIntervalDays" INTEGER NOT NULL DEFAULT 180;

-- CreateIndex
CREATE UNIQUE INDEX "Category_gymId_name_key" ON "Category"("gymId", "name");

-- CreateIndex
CREATE INDEX "Equipment_gymId_idx" ON "Equipment"("gymId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_gymId_inventoryNumber_key" ON "Equipment"("gymId", "inventoryNumber");
