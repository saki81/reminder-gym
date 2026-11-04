import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isOwner } from "../middlewares/isOwner.js";
import { validate } from "../middlewares/validate.middleware.js"; 
import { inviteLimiter, 
         invitationPreviewLimiter, 
         acceptInviteLimiter } from "../middlewares/rateLimit.middleware.js";
import {
    inviteStaffSchema,
    updateStaffGymsSchema,
    staffStatusSchema,
    invitationTokenSchema,
    acceptInvitationSchema,
} from "../validators/schema.validator.js";
import {
    getStaff,
    updateStaffGyms,
    activateStaff,
    deactivateStaff,
    removeStaff,
    inviteStaff,
    getInvitations,
    resendInvitation,
    revokeInvitation,
    previewInvitation,
    acceptInvitation,
    acceptInvitationExisting,
} from "../controllers/staff.controller.js";
 
const router = express.Router();

// JAVNO (radnik koji jos nema nalog)
router.post("/invitations/preview", invitationPreviewLimiter, validate(invitationTokenSchema), previewInvitation);
router.post("/accept", acceptInviteLimiter, validate(acceptInvitationSchema), acceptInvitation);

// PRIJAVLJEN RADNIK (ima nalog)
router.post("/accept-existing", verifyToken, acceptInviteLimiter, validate(invitationTokenSchema), acceptInvitationExisting);
 
//OWNER
router.use(verifyToken);
router.use(isOwner);

router.get("/", getStaff);

router.get("/invitations", getInvitations);
router.post("/invitations", inviteLimiter, validate(inviteStaffSchema), inviteStaff);
router.post("/invitations/:id/resend", inviteLimiter, resendInvitation);
router.delete("/invitations/:id", revokeInvitation);
 
router.patch("/:userId/gyms", validate(updateStaffGymsSchema), updateStaffGyms);
router.patch("/:userId/activate", validate(staffStatusSchema), activateStaff);
router.patch("/:userId/deactivate", validate(staffStatusSchema), deactivateStaff);
 
router.delete("/:userId", removeStaff);
 
export default router;



