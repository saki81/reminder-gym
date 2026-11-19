import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useAuth } from "@/hooks/shared/useAuth";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";
import type { UpdateProfile } from "@/types";
 
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, login } = useAuth();
  const toast = useToast();
 
  return useMutation({
    mutationFn: (payload: UpdateProfile) => authApi.updateProfile(payload),
 
    onSuccess: (res) => {
     
      if (user) {
        login({ ...user, name: res.data.user.name ?? undefined });
      }
 
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated successfully");
    },
 
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    },
  });
};