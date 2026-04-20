import { apiClient } from "./clientApi";
import type {
  Register,
  Login,
  ForgotPassword,
  VerifyOtp,
  ResetPassword
} from "../types/index";


export const authApi = {

    me: () => apiClient.get("/auth/me"),

    register: (data: Register) =>
        apiClient.post("/auth/register", data),

    login: (data: Login) =>
        apiClient.post("/auth/login", data),

    logout: () => apiClient.post("/auth/logout"),

    forgotPassword: (data: ForgotPassword) =>
        apiClient.post("/auth/forgot-password", data),

    sendVerifyOtp: (data: VerifyOtp) => 
        apiClient.post("/auth/send-verify-otp", data),

    emailVerified: (otp: string) => 
        apiClient.post("/auth/verify-email", { otp }),

    resetPassword: (data: ResetPassword) => 
        apiClient.post("/auth/reset-password", data)
}