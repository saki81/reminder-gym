import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { useToast } from "../shared/useToast";
import type { ForgotPassword } from "@/types";


export function useForgotPassword() {
    const navigate = useNavigate();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: ForgotPassword) => authApi.forgotPassword(data),

        onSuccess: (_, data) => {
            toast.success(`Reset code sent to ${data.email}`);

            navigate("/verify-otp", {
                replace: true,
                state: { 
                    email: data.email,
                    type: "reset-password", 
                },
            })
        }
    })
}