import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import type { Login } from "@/types";
import { useToast } from "../shared/useToast";
import { useAuth } from "../shared/useAuth";



export function useLogin() {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth()

    return useMutation({
      mutationFn: (data: Login) => authApi.login(data),

        onSuccess: async () => {
           
             const user = await authApi.me(); 
             queryClient.setQueryData(["me"], user);

             login(user)

             toast.success(`Welcome back, ${user.name ?? user.email ?? ""}!`)
             navigate("/gym", { replace: true });
        }
    });
}

