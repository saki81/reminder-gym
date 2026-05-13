import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { useAuth } from "../shared/useAuth";
import { useToast } from "../shared/useToast";



export function useVerifyEmail() {
    const { login} = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
      mutationFn: (otp: string) => authApi.emailVerified(otp),

      onSuccess: async () => {

     
       const user = await queryClient.fetchQuery({
         queryKey: ["me"],
         queryFn: authApi.me
    });

    login(user);
    

  console.log("UPDATED USER:", user);
  console.log("gymId:", user?.gymId);
  console.log("emailVerified:", user?.emailVerified);

  toast.success("Email verified! Welcome to Reminder Gym");

  if (!user.emailVerified) return;



  if (!user.gymId) {
    navigate("/gym/create", { replace: true });
    return;
  }

  navigate("/dashboard", { replace: true });

  
   }
 });
}