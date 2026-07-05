import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { useToast } from "../shared/useToast";
import type { ResetPassword } from "@/types";


export function useResetPassword () {
    const navigate = useNavigate();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: ResetPassword) => authApi.resetPassword(data),

        onSuccess: () => {
            
            toast.success("Reset password successfully");

            navigate("/login", {
                replace: true,
             
            })
        }
    });
}