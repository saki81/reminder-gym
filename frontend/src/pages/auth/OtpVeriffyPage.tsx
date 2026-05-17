import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { OtpVerificationForm }          from "@/components/auth/OtpVerificationForm";
import { useSendVerifyOtp }                 from "@/hooks/auth/useSendVerifyOtp";
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { useToast }                     from "@/hooks/shared/useToast";
import { getErrorMessage }              from "@/hooks/shared/useFieldErrors";
import { useVerifyResetOtp } from "@/hooks/auth/useVerifyResetOtp";



export const VerifyOtpPage = () => {

  const location = useLocation();
  const navigate = useNavigate()
  const toast = useToast();

  // state from navigation
  const email = location.state?.email;

  // register or reset-password
  const type = location.state?.type;

  const fromRegister = type === "register";
  const fromResetPassword = type ==="reset-password";
 
  const { mutate: sendOtp, isPending: isResending } = useSendVerifyOtp();
  const { mutate: verifyResetOtp,  isPending: isVerifyingReset } = useVerifyResetOtp();
  const { mutate: emailVerified, isPending: isVerifyingEmail} = useVerifyEmail();

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
      verifyResetOtp({otp}, {
       onSuccess: (data) => {
          navigate("/reset-password", {
            replace: true,
            state: {
              token: data.resetToken,
              email
            }
          })
       },
         onError: (err) =>
      toast.error(getErrorMessage(err, "Invalid or expired code."))
     })
     return
     } 
    };

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
        isPending={isVerifyingEmail || isVerifyingReset}
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
