import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import type { Register } from "../../types/index";
import { useToast } from "../shared/useToast";


export function useRegister() {
    const navigate = useNavigate();
    const toast = useToast()

    return useMutation({
        mutationFn: (data: Register) => authApi.register(data),

        onSuccess: (_, data ) => {
          
             toast.info("Verification code sent to your email");
             navigate("/verify-otp", {
                
                replace: true,
                state: { email: data.email, type: "register", },
            
            })
            
        }
    })
}