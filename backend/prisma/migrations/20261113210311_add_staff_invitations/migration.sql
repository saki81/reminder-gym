-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "StaffInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "invitedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffInvitationGym" (
    "invitationId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,

    CONSTRAINT "StaffInvitationGym_pkey" PRIMARY KEY ("invitationId","gymId")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffInvitation_tokenHash_key" ON "StaffInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "StaffInvitation_email_idx" ON "StaffInvitation"("email");

-- CreateIndex
CREATE INDEX "StaffInvitation_invitedById_status_idx" ON "StaffInvitation"("invitedById", "status");

-- CreateIndex
CREATE INDEX "StaffInvitationGym_gymId_idx" ON "StaffInvitationGym"("gymId");

-- AddForeignKey
ALTER TABLE "StaffInvitation" ADD CONSTRAINT "StaffInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffInvitationGym" ADD CONSTRAINT "StaffInvitationGym_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "StaffInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffInvitationGym" ADD CONSTRAINT "StaffInvitationGym_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;
