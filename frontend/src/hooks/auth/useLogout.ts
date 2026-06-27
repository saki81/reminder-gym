import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { useAuth } from "../shared/useAuth";
import { useGym } from "../shared/useGym";



export function useLogout() {
  const { logout } = useAuth();
  const { clearGym } = useGym();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      clearGym();
      queryClient.clear(); 
      navigate("/login", { replace: true });
    },
  });
}
