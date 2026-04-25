import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import type { Register } from "../../types/index"


export function useRegister() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: Register) => authApi.register(data),

        onSuccess: (_res, data ) => {

            navigate("/verify-otp", {
                state: { email: data.email },
            });
        }
    })
}