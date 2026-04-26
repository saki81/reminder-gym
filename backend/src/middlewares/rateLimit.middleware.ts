import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
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
    `${ipKeyGenerator(req.ip!)}-${req.body.email || "unknown"}`
})