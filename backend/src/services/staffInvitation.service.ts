import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { hashToken } from "../utils/hashToken.js";
import transporter from "../config/nodemailer.js"


export const INVITATION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export const MAX_PENDING_INVITATIONS = 50;

export const invitationInclude = {
    gyms: {
        include: {
            gym: { select: { id: true, gymName: true, city: true } },
        },
    },
    invitedBy: { select: { name: true } },
} satisfies Prisma.StaffInvitationInclude;

export type InvitationWithRelations = Prisma.StaffInvitationGetPayload<{
    include: typeof invitationInclude;
}>;


// Invitation format sent to the frontend
export const formatInvitation = (invitation: InvitationWithRelations) => ({
    id: invitation.id,
    email: invitation.email,
    status: invitation.status,
    createdAt: invitation.createdAt,
    expiresAt: invitation.expiresAt,
    expired: invitation.expiresAt.getTime() < Date.now(),
    gyms: invitation.gyms.map(({ gym }) => gym),
});

// The raw token goes only into the email; only its hash is stored in the database
export const generateInvitationToken = () => {
    const token = crypto.randomBytes(32).toString("hex");

    return { token, tokenHash: hashToken(token) };
};

export const findPendingInvitationByToken = (token: string) => {
    return prisma.staffInvitation.findFirst({
        where: {
            tokenHash: hashToken(token),
            status: "PENDING",
            expiresAt: { gt: new Date() },
        },
        include: invitationInclude,
    });
};

export const findUserByEmail = (email: string) => {
    return prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive"} },
        select: { id: true, email: true, emailVerified: true },
    });
};

const escapeHtml = (value: string) => 
    value.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#39;");

interface SendInvitationEmailParams {
    to: string;
    inviterName: string;
    gymNames: string[];
    token: string;
}
 
export const sendStaffInvitationEmail = async ({
    to,
    inviterName,
    gymNames,
    token,
}: SendInvitationEmailParams) => {
    const baseUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
    const link = `${baseUrl}/accept-invite?token=${token}`;
 
    await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject: "You have been invited to Reminder Gym",
 
        text: [
            `${inviterName} invited you to join Reminder Gym as staff.`,
            `Gyms: ${gymNames.join(", ")}`,
            "",
            `Accept the invitation: ${link}`,
            "",
            "The link is valid for 7 days and works only once.",
            "After accepting, you log in with your email and password.",
            "If you were not expecting this email, you can ignore it.",
        ].join("\n"),
 
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>You have been invited to Reminder Gym</h2>
                <p><strong>${escapeHtml(inviterName)}</strong> invited you to join as staff.</p>
                <p>Gyms: <strong>${gymNames.map(escapeHtml).join(", ")}</strong></p>
                <p>
                    <a href="${link}"
                       style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;
                              text-decoration:none;border-radius:6px;">
                        Accept invitation
                    </a>
                </p>
                <p style="color:#666;font-size:13px;">
                    The link is valid for 7 days and works only once.
                    After accepting, you log in with your email and password.
                    If you were not expecting this email, you can ignore it.
                </p>
            </div>`,
    });
};


export const getGrantableGymIds = async (
    userId: string | null,
    invitation: InvitationWithRelations
) => {
     const invitedGymIds = invitation.gyms.map(({ gym }) => gym.id);

     const inviterOwnerRows = await prisma.admin.findMany({
        where: {
            userId: invitation.invitedById,
            role: "OWNER",
            isActive: true,
            gymId: { in: invitedGymIds },
        },
        select: { gymId: true },
     });

     const ownedByInviter = new Set(inviterOwnerRows.map((row) => row.gymId));
     const candidateGymIds = invitedGymIds.filter((id) => ownedByInviter.has(id));

     if (!userId || candidateGymIds.length === 0) {
        return candidateGymIds;
    }
 
    const existingRows = await prisma.admin.findMany({
        where: { userId, gymId: { in: candidateGymIds } },
        select: { gymId: true, role: true, isActive: true },
    });
 
    const alreadyCovered = new Set(
        existingRows
            .filter((row) => row.role === "OWNER" || row.isActive)
            .map((row) => row.gymId)
    );
 
    return candidateGymIds.filter((id) => !alreadyCovered.has(id));

};


// "Zaključava" pozivnicu (PENDING -> ACCEPTED) unutar transakcije.
// Vraća false ako je neko već iskoristio ili opozvao pozivnicu (nikad se ne iskoristi dvaput).
export const claimInvitation = async (tx: Prisma.TransactionClient, invitationId: string) => {
    const result = await tx.staffInvitation.updateMany({
        where: {
            id: invitationId,
            status: "PENDING",
            expiresAt: { gt: new Date() },
        },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
    });
 
    return result.count > 0;
};
 
// Kreira STAFF Admin redove ili reaktivira deaktivirane STAFF redove
export const grantStaffAccess = async (
    tx: Prisma.TransactionClient,
    userId: string,
    gymIds: string[]
) => {
    const existingRows = await tx.admin.findMany({
        where: { userId, gymId: { in: gymIds } },
        select: { id: true, gymId: true, role: true },
    });
 
    const existingGymIds = new Set(existingRows.map((row) => row.gymId));
    const gymIdsToCreate = gymIds.filter((id) => !existingGymIds.has(id));
    const rowIdsToReactivate = existingRows
        .filter((row) => row.role === "STAFF")
        .map((row) => row.id);
 
    if (gymIdsToCreate.length > 0) {
        await tx.admin.createMany({
            data: gymIdsToCreate.map((gymId) => ({
                userId,
                gymId,
                role: "STAFF" as const,
            })),
        });
    }
 
    if (rowIdsToReactivate.length > 0) {
        await tx.admin.updateMany({
            where: { id: { in: rowIdsToReactivate } },
            data: { isActive: true },
        });
    }
};
