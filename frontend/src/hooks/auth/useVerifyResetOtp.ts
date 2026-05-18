import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

export function useVerifyResetOtp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.verifyResetOtp,

    onSuccess: (data) => {
      
      const resetToken = data.resetToken;

      console.log("RESET TOKEN:", resetToken);

      navigate("/reset-password", {
        state: {token: resetToken }
      });
    },
  });
}
