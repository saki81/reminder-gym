import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import type { Login } from "@/types";
import { useToast } from "../shared/useToast";



export function useLogin() {
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const toast = useToast();

    return useMutation({
      mutationFn: (data: Login) => authApi.login(data),

        onSuccess: async () => {
            
            await queryClient.invalidateQueries({  queryKey: ["me"] })

             const me = queryClient.getQueryData<any>(["me"]);

             const user = me.data.user; 

             toast.success(`Welcome back, ${user.name ?? user.email ?? ""}!`)
            
             navigate("/dashboard", { replace: true });
        }
    });
}