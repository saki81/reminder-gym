import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";
 
export const useRemoveStaff = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
 
  return useMutation({
    mutationFn: (userId: string) => staffApi.removeStaff(userId),
 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "members"] });
      toast.success("Staff member removed successfully");
    },
 
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to remove staff member"));
    },
  });
};
 