import { Link } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRegister } from "@/hooks/auth/useRegister";
import { applyFieldErrors } from "@/hooks/shared/useFieldErrors";
import type { Register } from "@/types";
import type { UseFormSetError } from "react-hook-form";

type RegisterFormData = Register & { confirmPassword: string };


export const RegisterPage = () => {

    const { mutate: register, isPending, error} = useRegister();

    const handleSubmit = (data: Register, setError: UseFormSetError<RegisterFormData>) => {
       register(data, {
        onError: (err) => applyFieldErrors(err, setError)
       })
    }


return (
       <>    
        <RegisterForm 
           onSubmit={handleSubmit}
           isPending={isPending}
           error={error}
           />
          {/* Footer link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
       </> 
  )
};