import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";
import type { ChangePassword } from "@/types";
 
export const useChangePassword = () => {
  const toast = useToast();
 
  return useMutation({
    mutationFn: (payload: ChangePassword) => authApi.changePassword(payload),
 
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
 
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to change password"));
    },
  });
};