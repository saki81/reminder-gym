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
            
             const user = await queryClient.fetchQuery({
                queryKey: ["me"],
                queryFn: authApi.me
             })

             login(user)

             toast.success(`Welcome back, ${user.name ?? user.email ?? ""}!`)

            
             navigate("/gym", { replace: true });
        }
    });
}

/*import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi }     from "@/api/authApi";
import { useAuth }     from "../shared/useAuth";
import { useToast }    from "../shared/useToast";
import type { Login }  from "@/types";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate    = useNavigate();
  const toast       = useToast();
  const { login }   = useAuth();

  return useMutation({
    mutationFn: (data: Login) => authApi.login(data),

    onSuccess: async () => {
      // fetchQuery vraća axios response { data: { user: {...} } }
      const res  = await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn:  authApi.me,
      });

      // ✅ izvuci user iz response
      const user = res.data?.user;

      if (!user) {
        toast.error("Failed to load user. Please try again.");
        return;
      }

      login(user);
      toast.success(`Welcome back, ${user.name ?? user.email ?? ""}!`);
      navigate("/gym", { replace: true });
    },
  });
}*/