 import { useMutation } from "@tanstack/react-query";
 import { useToast } from "../shared/useToast";
 
 import { authApi } from "@/api/authApi";


 
 export function useSendVerifyOtp() {
   const toast = useToast();
   
    return useMutation({
      mutationFn: () => authApi.sendVerifyOtp(),
      
      onSuccess: () =>
         toast.info("Verification code sent to your email"),

      onError: () =>
         toast.error("Failed to send verification code. Try again")
    });
 }