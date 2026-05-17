import { useLocation, Navigate } from "react-router-dom";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { useToast } from "@/hooks/shared/useToast";
import { applyFieldErrors, getErrorMessage, getFieldErrors } from "@/hooks/shared/useFieldErrors";
import type { UseFormSetError } from "react-hook-form";


type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
}


export const ResetPasswordPage = () => {
  const { state } = useLocation();
  const token = state?.token as string | undefined;
  const toast = useToast();

  if (!token) return <Navigate to="/forgot-password" replace />

  const { mutate: resetPassword, isPending } = useResetPassword()

  const handleSubmit = (password: string, setError: UseFormSetError<ResetPasswordFormData>) => {
      resetPassword(
        { token, password },
        {
           onError: (err) => {
              const feildErrors = getFieldErrors(err);
              const hasFieldErrors = Object.keys(feildErrors).length > 0;

              if (hasFieldErrors) {
                 applyFieldErrors(err, setError);
              } else {
                 toast.error(getErrorMessage(err, "Failed to reset password. Try again." ))
              }
           }
        } 
     )
  }
  return (
       <ResetPasswordForm 
          onSubmit={handleSubmit}
          isPending={isPending}
       />
  )
}
