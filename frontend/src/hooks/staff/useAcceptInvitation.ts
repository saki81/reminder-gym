import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { staffApi } from "@/api/staffApi";
import { useAuth } from "@/hooks/shared/useAuth";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";
import { setActiveGymId } from "@/utils/activeGym";
import type { AcceptInvitation } from "@/types";

//  Worker does NOT have account: backend creates account, grants access and sets cookie (already logged in)
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (payload: AcceptInvitation) => staffApi.acceptInvitation(payload),

    onSuccess: async () => {

      setActiveGymId(null);

      const user = await authApi.me();
      queryClient.setQueryData(["me"], user);

      login(user);

      toast.success(`Welcome, ${user.name ?? user.email ?? ""}!`);
      navigate("/dashboard", { replace: true });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to accept invitation"));
    },
  });
};