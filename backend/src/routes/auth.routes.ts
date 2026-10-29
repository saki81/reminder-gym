import express from "express";
import { register, login, logout,verifyResetOtp, resetPassword, forgotPassword, sendVerifyOtp, verifyEmail, getMe, updateProfile, changePassword } from "../controllers/auth.controller.js";
import { registerLimiter, loginLimiter, otpLimiter, resetPasswordLimiter, forgotPasswordLimiter, changePasswordLimiter } from "../middlewares/rateLimit.middleware.js";
import { registerSchema,loginSchema, verifyOtpSchema, resetPasswordSchema, forgotPasswordSchema, updateProfileSchema, changePasswordSchema } from "../validators/schema.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/send-verify-otp",verifyToken, otpLimiter, sendVerifyOtp);
router.post("/verify-email",verifyToken, otpLimiter, validate(verifyOtpSchema), verifyEmail);
router.post("/reset-password", resetPasswordLimiter, validate(resetPasswordSchema), resetPassword);
router.post("/verify-reset-otp", otpLimiter, verifyResetOtp);
router.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.get("/me", verifyToken, getMe );
router.patch("/me", verifyToken, validate(updateProfileSchema), updateProfile);                                            
router.post("/change-password", verifyToken, changePasswordLimiter, validate(changePasswordSchema), changePassword); 



export default  router;