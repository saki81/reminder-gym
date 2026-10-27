import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

const userKey = (req: Request) => req.user?.userId ?? ipKeyGenerator(req.ip!);

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  skipSuccessfulRequests: true, 
  message: {
   message: "Too many login attempts"
  }
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: {
   message: "Too many accounts created from this IP.",
  }
});

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
   message: "To many OTP attempts, try again later"
  }
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
   message: "Too many reset attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
   message: "Too many password reset requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
   keyGenerator: (req: Request) =>
    `${ipKeyGenerator(req.ip!)}-${String(req.body.email || "unknown").trim().toLowerCase()}`
});

export const changePasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many password change attempts. Try again later",
  }, 
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKey 
});

export const inviteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
   message: "Too many invitations sent. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKey
});
 
export const invitationPreviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
   message: "Too many attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false
});
 
export const acceptInviteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
   message: "Too many attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false
});
