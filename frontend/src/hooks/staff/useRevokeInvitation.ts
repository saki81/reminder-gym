import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";
 
export const useRevokeInvitation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
 
  return useMutation({
    mutationFn: (invitationId: string) => staffApi.revokeInvitation(invitationId),
 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "invitations"] });
      toast.success("Invitation revoked successfully");
    },
 
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to revoke invitation"));
    },
  });
};