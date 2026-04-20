export type Role = "ADMIN" | "OWNER";

export type User = {
   id: string;
   email: string;
   name?: string;
   role: Role;
   gymId?: string;
   emailVerified: boolean;
}

// Auth API type
export type Register = {
   email: string;
   name: string;
   password: string;
};
export type Login = {
   email: string;
   password: string;
};
export type ForgotPassword = {
   email: string;
};
export type VerifyOtp = {
  // email: string;
   otp: string;
};
export type ResetPassword = {
   token: string;
   password: string;
}

// API response error  from backend Zod validation
export type ApiError = {
    message: string;
    errors?: Record<string, string[]>
}