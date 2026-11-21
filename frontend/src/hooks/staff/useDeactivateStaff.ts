import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";
 
type Variables = {
  userId: string;
  gymIds?: string[]; // without gymIds = all owner gyms
};
 
export const useDeactivateStaff = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
 
  return useMutation({
    mutationFn: ({ userId, gymIds }: Variables) =>
      staffApi.deactivateStaff(userId, { gymIds }),
 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "members"] });
      toast.success("Staff member deactivated successfully");
    },
 
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to deactivate staff member"));
    },
  });
};