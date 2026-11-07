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


// DELETE /api/staff/:userId
export const removeStaff = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
};

// OWNER: INVITATIONS

// POST
export const inviteStaff = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
};

// GET /api/staff/invitations
export const getInvitations = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
};

// POST /api/staff/invitations/:id/resend   (new token)
export const resendInvitation = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
};

// DELETE /api/staff/invitations/:id 
export const revokeInvitation = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
};

// STAFF MEMBER: REVIEW AND ACCEPTANCE OF INVITATION
export const previewInvitation = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
};

// POST /api/staff/accept
export const acceptInvitation = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
};

// POST /api/staff/accept-existing   body: { token }   (verifyToken, employee already has an account)
export const acceptInvitationExisting = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
}
 