import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { OtpVerificationForm }          from "@/components/auth/OtpVerificationForm";
import { useSendVerifyOtp }                 from "@/hooks/auth/useSendVerifyOtp";
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { useToast }                     from "@/hooks/shared/useToast";
import { getErrorMessage }              from "@/hooks/shared/useFieldErrors";




export const VerifyOtpPage = () => {
//  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate()
  const toast = useToast();

  // state from navigation
  const email = location.state?.email;
 // const fromRegister = location.state?.fromRegister;
  // register or reset-password
  const type = location.state?.type;

  const fromRegister = type === "register";
  const fromResetPassword = type ==="reset-password";
 
  const { mutate: sendOtp, isPending: isResending } = useSendVerifyOtp()
  const { mutate: emailVerified, isPending } = useVerifyEmail();

   if (!type) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (otp: string) => {

    // register flow
    if (fromRegister) { 
       
        emailVerified(otp, {

        onError: (err) =>

          toast.error(
            getErrorMessage(
              err,
              "Invalid or expired code. Try again."
            )
          ),
      });

      return;
  }

  // reset password flow
  if (fromResetPassword) {
     
      navigate("/reset-password", {
        replace: true,

        state: { otp, email }
      })
     }
      return;
  }

  return (
    <>
      {/* Email info */}
      {email && (
        <p className="text-center text-sm text-muted-foreground mb-6 -mt-4">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      )}

      <OtpVerificationForm
        onSubmit={handleSubmit}
        onResend={() => sendOtp()}
        isPending={isPending}
        isResending={isResending}
      
      />
 
     <p className="text-center text-sm text-muted-foreground mt-6">
        Wrong email?{" "}
        <Link
          to="/forgot-password"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Change it
        </Link>
      </p> 
    </>
  )
}
