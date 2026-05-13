import { Link } from "react-router-dom"
import { ForgotPasswordForm } from "@/components/auth/ForgotPassworForm";
import { useToast } from "@/hooks/shared/useToast";
import { applyFieldErrors, getFieldErrors, getErrorMessage } from "@/hooks/shared/useFieldErrors";
import type { ForgotPassword } from "@/types";
import type { UseFormSetError } from "react-hook-form";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";


export const ForgotPasswordPage = () => {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const toast = useToast();

  const handleSubmit = (data: ForgotPassword, setError: UseFormSetError<ForgotPassword>) => {

     forgotPassword(data, {
       onError: (err) => {
        const fieldErrors = getFieldErrors(err);
        const hashFieldErrors = Object.keys(fieldErrors).length > 0;

        if(hashFieldErrors) {
           applyFieldErrors(err, setError);
        } else {
           toast.error(getErrorMessage(err, "Failed to send reset code. Try again." ))
        }
       }
     })
  }
  return (
      <>
         <ForgotPasswordForm 
            onSubmit={handleSubmit}
            isPending={isPending}
            />

          <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your password?{" "}
              <Link
               to="/login"
               className="text-primary font-medium hover:underline underline-offset-4"
             >
                  Sign in
              </Link>
          </p>

      </>
  )
}
