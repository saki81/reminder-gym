import { apiClient } from "./clientApi";
import type {
  Register,
  Login,
  ForgotPassword,
  ResetPassword
} from "../types/index";


export const authApi = {

    me: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data.user;
   },

    register: (data: Register) =>
        apiClient.post("/auth/register", data),

    login: (data: Login) =>
        apiClient.post("/auth/login", data),

    logout: () => apiClient.post("/auth/logout"),

    forgotPassword: (data: ForgotPassword) =>
        apiClient.post("/auth/forgot-password", data),

    sendVerifyOtp: () => 
        apiClient.post("/auth/send-verify-otp"),

    emailVerified: (otp: string) => 
        apiClient.post("/auth/verify-email", { otp }),

    verifyResetOtp: async (data: { otp: string }) => {
    const res = await apiClient.post("/auth/verify-reset-otp", data);
    return res.data;
  },

    resetPassword: (data: ResetPassword) => 
        apiClient.post("/auth/reset-password", data)
}