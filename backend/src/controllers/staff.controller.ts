import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../utils/jwtToken.js";
import { getOwnedGyms, syncActiveGym } from "../utils/staffAccess.js";
import {
    INVITATION_TTL_MS,
    MAX_PENDING_INVITATIONS,
    invitationInclude,
    formatInvitation,
    generateInvitationToken,
    findPendingInvitationByToken,
    findUserByEmail,
    sendStaffInvitationEmail,
    getGrantableGymIds,
    claimInvitation,
    grantStaffAccess
} from "../services/staffInvitation.service.js";

const INVALID_INVITATION = "Invitation is invalid or has expired";

const authCookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// OWNER

// GET api/staff
export const getStaff = async (req: Request, res: Response) => {
    try {
       const userId = req.user!.userId;
       
       const ownedGyms = await getOwnedGyms(userId);
       const ownedGymIds = ownedGyms.map((gym) => gym.id);

       const rows = await prisma.admin.findMany({
           where: { role: "STAFF", gymId: { in: ownedGymIds} },
           select: {
                id: true,
                isActive: true,
                gym: { select: { id: true, gymName: true, city: true, isActive: true }},
                user: {
                    select: { id: true, name: true, email: true, isActive: true },
                },
           },
            orderBy: { createdAt: "asc" },
       });

        // One entry per staff member, including a list of their gyms
        const staffByUserId = new Map<string, {
            userId: string;
            name: string | null;
            email: string;
            accountActive: boolean;
            memberships: {
                adminId: string;
                gymId: string;
                gymName: string;
                city: string | null;
                isActive: boolean;
                gymActive: boolean;
            }[];
        }>();

                for (const row of rows) {
            if (!row.gym) {
                continue;
            }
 
            let member = staffByUserId.get(row.user.id);
 
            if (!member) {
                member = {
                    userId: row.user.id,
                    name: row.user.name,
                    email: row.user.email,
                    accountActive: row.user.isActive,
                    memberships: [],
                };
                staffByUserId.set(row.user.id, member);
            }
 
            member.memberships.push({
                adminId: row.id,
                gymId: row.gym.id,
                gymName: row.gym.gymName,
                city: row.gym.city,
                isActive: row.isActive,
                gymActive: row.gym.isActive,
            });
        }
          
        return res.status(200).json({ staff: Array.from(staffByUserId.values())})

    } catch (error) {
        console.error("getStaff error:", error);
 
        return res.status(500).json({ message: "Server error" });

    }
};

// PATCH /api/staff/:userId/gyms
export const updateStaffGyms = async (req: Request, res: Response) => {
    try {
       const ownerId = req.user!.userId;
       const staffUserId = String(req.params.userId);
       const { gymIds } = req.body as { gymIds: string[] };
       
       const ownedGyms = await getOwnedGyms(ownerId);
       const ownedGymIds = ownedGyms.map((gym) => gym.id);
       const activeOwnedGymIds = ownedGyms.filter((gym) => gym.isActive).map((gym) => gym.id);

       if (gymIds.some((id) => !activeOwnedGymIds.includes(id))) {
           return res.status(403).json({
                message: "You can only manage access for active gyms you own",
           });
       }

     //  Employee records ONLY in the owner's gyms (gyms belonging to others remain untouched)
       const currentRows = await prisma.admin.findMany({
           where: { userId: staffUserId, gymId: { in: ownedGymIds } },
           select: { id: true, gymId: true, role: true },
       });

       if (!currentRows.some((row) => row.role === "STAFF" )) {
            return res.status(409).json({
                message: "Cannot change access for an owner of the gym",
            });
       }

       const rowByGymId = new Map(currentRows.map((row) => [row.gymId, row]));

       if (gymIds.some((id) => rowByGymId.get(id)?.role === "OWNER")) {
           return res.status(409).json({
              message: "Cannot change access for an owner of the gym",
           });
       }

       const gymIdsToAdd = gymIds.filter((id) => !rowByGymId.has(id));
       const rowIdsToRemove = currentRows
            .filter((row) => row.role === "STAFF" && row.gymId && !gymIds.includes(row.gymId))
            .map((row) => row.id);

       await prisma.$transaction(async (tx) => {
           if (rowIdsToRemove.length > 0) {
               await tx.admin.deleteMany({ where: { id: { in: rowIdsToRemove } } });
           }

           if (gymIdsToAdd.length > 0) {
               await tx.admin.createMany({
                  data: gymIdsToAdd.map((gymId) => ({
                      userId: staffUserId,
                      gymId,
                      role: "STAFF" as const,
                  })),
               });
           }

           await syncActiveGym(tx, staffUserId);
       });

       return res.status(200).json({ message: "Staff access updated successfully" });
    } catch (error) {
        console.error("updatedStaffGyms error:", error);

        return res.status(500).json({ message: "Server error" });
    }
};

// Shared logic for activate / deactivate
const changeStaffStatus = async (req: Request, res: Response, isActive: boolean) => {
    try {
        const ownerId = req.user!.userId;
        const staffUserId = String(req.params.userId);
        const { gymIds } = req.body as { gymIds?: string[] };

        const ownedGyms = await getOwnedGyms(ownerId);
        const ownedGymIds = ownedGyms.map((gym) => gym.id);

        if (gymIds && gymIds.some((id) => !ownedGymIds.includes(id))) {
            return res.status(403).json({ message: "You can only manage gyms you own" });
        }

        const rows = await prisma.admin.findMany({
            where: {
                userId: staffUserId,
                role: "STAFF",
                gymId: { in: gymIds ?? ownedGymIds },
            },
            select: { id: true, isActive: true },
        });
 
        if (rows.length === 0) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        const rowIdsToChange = rows
            .filter((row) => row.isActive !== isActive)
            .map((row) => row.id);
 
        if (rowIdsToChange.length === 0) {
            return res.status(400).json({
                message: isActive ? "Staff member is already active" : "Staff member is already inactive",
            });
        }
 
        await prisma.$transaction(async (tx) => {
            await tx.admin.updateMany({
                where: { id: { in: rowIdsToChange } },
                data: { isActive },
            });
 
            await syncActiveGym(tx, staffUserId);
        });
 
        return res.status(200).json({
            message: isActive ? "Staff member activated successfully" : "Staff member deactivateed successfully",
        })

    } catch (error) {
         console.error("changeStaffStatus error:", error);

         return res.status(500).json({ message: "Server error" });
    }
};

// PATCH /api/staff/:userId/activate
export const activateStaff = (req: Request, res: Response) => changeStaffStatus(req, res, true);

// PATCH /api/staff/:userId/deactivate
export const deactivateStaff = (req: Request, res: Response) => changeStaffStatus(req, res, false);


// DELETE /api/staff/:userId / removes staff access only within the owner the staff account is not deleted
export const removeStaff = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user!.userId;
        const staffUserId = String(req.params.userId);

        const ownedGymIds = (await getOwnedGyms(ownerId)).map((gym) => gym.id);

        const rows = await prisma.admin.findMany({
            where: { userId: staffUserId, role: "STAFF", gymId: { in: ownedGymIds } },
            select: { id: true },
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        await prisma.$transaction(async (tx) => {
            await tx.admin.deleteMany({
                where: { id:  { in: rows.map((row) => row.id) } },
            });

            await syncActiveGym(tx, staffUserId);
        });

        return res.status(200).json({ message: "Staff member removed successfully" });
    } catch (error) {
        console.error("removeStaff error:", error);
 
        return res.status(500).json({ message: "Server error" });

    }
};

// OWNER: INVITATIONS

// POST  /api/staff/invitations
export const inviteStaff = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user!.userId;
        const { email, gymIds } = req.body as { email: string; gymIds: string[] };

        const owner = await prisma.user.findUnique({
            where: { id: ownerId },
            select: { name: true, email: true },
        });

        if (!owner) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (owner.email.toLowerCase() === email) {
            return res.status(400).json({ message: "You cannot invite yourself" });
        }

        const activeOwnedGyms = await getOwnedGyms(ownerId, true);
        const gymNameById = new Map(activeOwnedGyms.map((gym) => [gym.id, gym.gymName]));

        if (gymIds.some((id) => !gymNameById.has(id))) {
            return res.status(403).json({
                message: "You can only invite staff to active gyms you own",
            });
        }
        
        const pendingCount = await prisma.staffInvitation.count({
            where: { invitedById: ownerId, status: "PENDING"}
        })

        if (pendingCount >= MAX_PENDING_INVITATIONS) {
            return res.status(400).json({
                message: "Too many pending invitations. Revoke some first.",
            })
        }


        let gymIdsToGrant = gymIds;
        const existingUser = await findUserByEmail(email);
 
        if (existingUser) {
            const rows = await prisma.admin.findMany({
                where: { userId: existingUser.id, gymId: { in: gymIds } },
                select: { gymId: true },
            });
 
            const alreadyHaveAccess = new Set(rows.map((row) => row.gymId));
            gymIdsToGrant = gymIds.filter((id) => !alreadyHaveAccess.has(id));
 
        if (gymIdsToGrant.length === 0) {
                return res.status(409).json({
                    message: "This person already has access to the selected gyms",
                });
            }
        }
 
        const { token, tokenHash } = generateInvitationToken();
 
        const invitation = await prisma.staffInvitation.create({
            data: {
                email,
                tokenHash,
                invitedById: ownerId,
                expiresAt: new Date(Date.now() + INVITATION_TTL_MS),
                gyms: { create: gymIdsToGrant.map((gymId) => ({ gymId })) },
            },
            include: invitationInclude,
        });

                try {
            await sendStaffInvitationEmail({
                to: email,
                inviterName: owner.name ?? "A gym owner",
                gymNames: gymIdsToGrant.map((id) => gymNameById.get(id)!),
                token,
            });

        } catch (mailError) {
            console.error("inviteStaff email error:", mailError);
 
            await prisma.staffInvitation.delete({ where: { id: invitation.id } });
 
            return res.status(502).json({ message: "Failed to send invitation email" });
        }
 
        // Novi poziv istom emailu poništava prethodne (tek nakon uspješnog slanja)
        await prisma.staffInvitation.updateMany({
            where: {
                invitedById: ownerId,
                status: "PENDING",
                email: { equals: email, mode: "insensitive" },
                id: { not: invitation.id },
            },
            data: { status: "REVOKED" },
        });

            return res.status(201).json({
                message: "Invitation sent successfully",
                invitation: formatInvitation(invitation),
            });

    } catch (error) {
        console.error("inviteStaff error:", error);
 
        return res.status(500).json({ message: "Server error" });

    }
};

// GET /api/staff/invitations
export const getInvitations = async (req: Request, res: Response) => {
    try {
        const  invitations = await prisma.staffInvitation.findMany({
            where: { invitateById: req.user!.userId, status: "PENDING" },
            include: invitationInclude,
            orderBy: { createdAt: "desc" },
        })

        return res.status(200).json({ invitations: invitations.map(formatInvitation) });
    } catch (error) {
        console.error("getInvitations error:", error);

        return res.status(500).json({ message: "Server error"})
    }
};

// POST /api/staff/invitations/:id/resend   (new token)
export const resendInvitation = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user!.userId;
 
        const invitation = await prisma.staffInvitation.findFirst({
            where: { id: String(req.params.id), invitedById: ownerId, status: "PENDING" },
            include: invitationInclude,
        });
 
        if (!invitation) {
            return res.status(404).json({ message: "Invitation not found" });
        }
 
        // Samo teretane koje owner i dalje posjeduje i koje su aktivne
        const activeOwnedGymIds = (await getOwnedGyms(ownerId, true)).map((gym) => gym.id);
        const validGyms = invitation.gyms.filter(({ gym }) => activeOwnedGymIds.includes(gym.id));
 
        if (validGyms.length === 0) {
            return res.status(400).json({
                message: "None of the invited gyms are available anymore",
            });
        }
 
        const owner = await prisma.user.findUnique({
            where: { id: ownerId },
            select: { name: true },
        });
 
        const { token, tokenHash } = generateInvitationToken();
 
        // Prvo se šalje mail, pa se tek onda mijenja hash (ako slanje padne, stari link i dalje radi)
        try {
            await sendStaffInvitationEmail({
                to: invitation.email,
                inviterName: owner?.name ?? "A gym owner",
                gymNames: validGyms.map(({ gym }) => gym.gymName),
                token,
            });
        } catch (mailError) {
            console.error("resendInvitation email error:", mailError);
 
            return res.status(502).json({ message: "Failed to send invitation email" });
        }
 
        const updated = await prisma.staffInvitation.update({
            where: { id: invitation.id },
            data: { tokenHash, expiresAt: new Date(Date.now() + INVITATION_TTL_MS) },
            include: invitationInclude,
        });
 
        return res.status(200).json({
            message: "Invitation resent successfully",
            invitation: formatInvitation(updated),
        });

        
    } catch (error) {
        console.error("resendInvitation error:", error);
 
        return res.status(500).json({ message: "Server error" });

    }
};

// DELETE /api/staff/invitations/:id  (opoziv)
export const revokeInvitation = async (req: Request, res: Response) => {
    try {
        const result = await prisma.staffInvitation.updateMany({
            where: {
                id: String(req.params.id),
                invitedById: req.user!.userId,
                status: "PENDING",
            },
            data: { status: "REVOKED" },
        });
        
        if (result.count === 0) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        return res.status(200).json({ message: "Invitation revoked successfully" });
    } catch (error) {
        console.error("revokeInvitation error:", error);
 
        return res.status(500).json({ message: "Server error" });

    }
};

// STAFF MEMBER: REVIEW AND ACCEPTANCE OF INVITATION
export const previewInvitation = async (req: Request, res: Response) => {
    try {
        const { token } = req.body as { token: string };

        const invitation = await findPendingInvitationByToken(token);

        if (!invitation) {
            return res.status(404).json({ message: INVALID_INVITATION });
        }

        const existingUser = await findUserByEmail(invitation.email);

        return res.status(200).json({
            invitation: {
                email: invitation.email,
                invitedBy: invitation.invitedBy.name ?? "A gym owner",
                expiresAt: invitation.expiresAt,
                accountExists: Boolean(existingUser),
                gyms: invitation.gyms.map(({ gym }) => gym)
            }
        })
    } catch (error) {
        console.error("previewInvitation error:", error);
 
        return res.status(500).json({ message: "Server error" });

    }
};

// POST /api/staff/accept
export const acceptInvitation = async (req: Request, res: Response) => {
    try {
         const { token, name, password } = req.body as {
            token: string;
            name: string;
            password: string;
        };
 
        const invitation = await findPendingInvitationByToken(token);
 
        if (!invitation) {
            return res.status(404).json({ message: INVALID_INVITATION });
        }
 
        if (await findUserByEmail(invitation.email)) {
            return res.status(409).json({
                message: "An account with this email already exists. Log in to accept the invitation.",
            });
        }
 
        const gymIds = await getGrantableGymIds(null, invitation);
 
        if (gymIds.length === 0) {
            return res.status(404).json({ message: INVALID_INVITATION });
        }
 
        const hashedPassword = await bcrypt.hash(password, 10);
 
        const user = await prisma.$transaction(async (tx) => {
            // Prvo se pozivnica zaključa: drugi zahtjev sa istim linkom ovdje dobija false
            const claimed = await claimInvitation(tx, invitation.id);
 
            if (!claimed) {
                return null;
            }
 
            // Email je potvrđen jer je link stigao baš na tu adresu
            const createdUser = await tx.user.create({
                data: {
                    email: invitation.email,
                    password: hashedPassword,
                    name,
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                },
            });
 
            await grantStaffAccess(tx, createdUser.id, gymIds);
            await syncActiveGym(tx, createdUser.id);
 
            return createdUser;
        });
 
        if (!user) {
            return res.status(404).json({ message: INVALID_INVITATION });
        }
 
        // Radnik je odmah prijavljen; svaki sljedeći put se prijavljuje emailom i lozinkom
        res.cookie("accessToken", signToken({ userId: user.id }), authCookieOptions);
 
        return res.status(201).json({ message: "Account created and invitation accepted" });
 
    } catch (error) {
        // dvije istovremene registracije istim emailom (unique constraint)
        if ((error as { code?: string }).code === "P2002") {
            return res.status(409).json({
                message: "An account with this email already exists. Log in to accept the invitation.",
            });
        }
 
        console.error("acceptInvitation error:", error);
 
        return res.status(500).json({ message: "Server error" });

    }
};

// POST /api/staff/accept-existing   body: { token }   (verifyToken, employee already has an account)
export const acceptInvitationExisting = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { token } = req.body as { token: string };

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, emailVerified: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const invitation = await findPendingInvitationByToken(token);

        if (!invitation) {
            return res.status(404).json({ message: INVALID_INVITATION });
        }

        if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
             return res.status(403).json({
                message: "This invitation was sent to a different email address",
             });
        }

        const gymIds = await getGrantableGymIds(userId, invitation);

        if (gymIds.length === 0) {
             return res.status(404).json({ message: INVALID_INVITATION });
        }

        const claimed = await prisma.$transaction(async (tx) => {
            const isClaimed = await claimInvitation(tx, invitation.id);

            if (!isClaimed) {
                return false;
            }

            await grantStaffAccess(tx, userId, gymIds);
            await syncActiveGym(tx, userId);

            if (!user.emailVerified) {
                await tx.user.update({
                    where: { id: userId },
                    data: { emailVerified: true, emailVerifiedAt: new Date() },
                });
            }

            return true;
        });

        if (!claimed) {
             return res.status(404).json({ message: INVALID_INVITATION });
        }

        return res.status(200).json({ message: "Invitation accepted successfully" });
    } catch (error) {
        console.error("acceptInvitationExisting error:", error);
 
        return res.status(500).json({ message: "Server error" });

    }
};
 