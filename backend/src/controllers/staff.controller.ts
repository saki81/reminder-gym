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

        // Jedan red po radniku, s listom njegovih teretana
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
        
    } catch (error) {
        
    }
};

// activate / deactivate
const changeStaffStatus = async (req: Request, res: Response, isActive: boolean) => {
    try {
        
    } catch (error) {
        
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
 