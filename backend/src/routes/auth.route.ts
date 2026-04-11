import express from "express";
import { register, login, logout, resetPassword, forgotPassword, sendVerifyOtp, verifyEmail, getMe } from "../controllers/auth.controller.js";
import { registerLimiter, loginLimiter, otpLimiter, resetPasswordLimiter, forgotPasswordLimiter } from "../middlewares/rateLimit.middleware.js";
import { registerSchema,loginSchema, verifyOtpSchema, resetPasswordSchema, forgotPasswordSchema } from "../validators/schema.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/send-verify-otp",verifyToken, otpLimiter, sendVerifyOtp);
router.post("/verify-email",verifyToken, otpLimiter, validate(verifyOtpSchema), verifyEmail);
router.post("/reset-password", resetPasswordLimiter, validate(resetPasswordSchema), resetPassword);
router.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.get("/me", verifyToken, getMe );


export default  router;