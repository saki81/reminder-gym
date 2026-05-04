import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useLogin } from "@/hooks/auth/useLogin";
import { useToast } from "@/hooks/shared/useToast";
import { applyFieldErrors, getErrorMessage, getFieldErrors } from "@/hooks/shared/useFieldErrors";

import type { Login } from "@/types";
import type { UseFormSetError } from "react-hook-form";
import { useEffect } from "react";


export const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Prikazuje success poruku ako je korisnik stigao ovdje nakon reset passworda
  const resetSuccess = location.state?.resetSuccess as boolean | undefined;

  useEffect(()=> {
     if (resetSuccess) {
        toast.success("Password reset successfully. Sign in below");
        // Clear state from history
        navigate(location.pathname, { replace: true, state: {}})
     }
  }, [resetSuccess, navigate, location.pathname])

  const handleSubmit = (data: Login, setError: UseFormSetError<Login>) => {
      
       login(data, {
    
         onError: (err) => {
           const fieldErrors = getFieldErrors(err);
           const hasFieldErrors = Object.keys(fieldErrors).length > 0;
           
           if (hasFieldErrors) {
            applyFieldErrors(err, setError)
           } else {
            toast.error(getErrorMessage(err, "Invalid email or password"));
           }
         }
       })
       
     }

  return (
     <>
    {/*  {resetSuccess && (() => {
         toast.success("Password reset successfuly. Sign in below");
         return null;
      })
     } */}

       <LoginForm
         onSubmit={handleSubmit}
         isPending={isPending}
         error={console.error}
        />
       
       <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary font-medium hover:underline underline-offset-4"
          >
            Create one
        </Link>
       </p>
     </>
  );
}
