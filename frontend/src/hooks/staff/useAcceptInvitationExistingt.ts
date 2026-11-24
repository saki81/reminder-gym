import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { staffApi } from "@/api/staffApi";
import { useAuth } from "@/hooks/shared/useAuth";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";

// The worker already has an account and is logged in with that email
export const useAcceptInvitationExisting = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (token: string) => staffApi.acceptInvitationExisting(token),

    onSuccess: async () => {
      const user = await authApi.me();
      queryClient.setQueryData(["me"], user);

      login(user);

      queryClient.invalidateQueries();

      toast.success("Invitation accepted successfully");
      navigate("/gym", { replace: true });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to accept invitation"));
    },
  });
};