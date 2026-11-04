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
        
    } catch (error) {
        
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
 