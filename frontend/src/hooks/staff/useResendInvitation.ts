import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";
 
export const useResendInvitation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
 
  return useMutation({
    mutationFn: (invitationId: string) => staffApi.resendInvitation(invitationId),
 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "invitations"] });
      toast.success("Invitation resent successfully");
    },
 
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to resend invitation"));
    },
  });
};