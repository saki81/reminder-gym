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
    <div className="min-h-svh grid place-items-center bg-background p-4">
        <div className="w-full max-w-md">
           
           {/* Card */}
           <div className="rounded-2xl border bg-card shadow-sm px-8 py-10">
             
             {/*Header */}
             <div className="text-center mb-8">
              <div className="imline-flex size-11 items-center justify-center rounded-xl bg-primary mb-4">
                 {/*Icon*/}
                               <svg
                viewBox="0 0 24 24"
                fill="white"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43
                         10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71
                         4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7
                         8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29
                         22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22
                         16.29l-1.43-1.43z" />
              </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-light">Creating account</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Start managing your gym today
              </p>
             </div>

             {/*Form*/}
             <RegisterForm 
                onSubmit={handleSubmit}
                isPending={isPending}
                error={error}
              />
           </div>
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
        </div>
    </div>
)


};