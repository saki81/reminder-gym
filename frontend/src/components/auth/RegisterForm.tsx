import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye,EyeOff } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

import { getErrorMessage, getFieldErrors } from "@/hooks/shared/useFieldErrors";

import type { Register } from "../../types/index";
import type { UseFormSetError } from "react-hook-form";

type RegisterFormData = Register & {
    confirmPassword: string;
}

type Props = {
    onSubmit: (data: Register, setError: UseFormSetError<RegisterFormData>) => void;
    isPending: boolean;
    error: unknown;
};

export const RegisterForm = ({ onSubmit, isPending, error }: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>();


    const fieldError = getFieldErrors(error);
    const hasFieldErrors = Object.keys(fieldError).length > 0;
    const globalError = error && hasFieldErrors
         ? getErrorMessage(error, "Registration failed. Please try again.")
         : null

    const handleFormSubmit = ({ confirmPassword: _, ...data}: RegisterFormData) => {
         onSubmit(data, setError)
    }

    return (
       <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">
           
           {globalError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20
                              px-4 py-3 text-sm text-destructive text-center">
                 {globalError}
              </div>
           )}

           <div className="space-y-1.5">
             <Label htmlFor="name">Full name</Label>
             <Input 
                id="name"
                type="text"
                autoComplete="name"
                placeholder="JohnSmith"
                aria-invalid={!!errors.name}
                {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
           </div>

           <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
           <Label htmlFor="password">Password</Label>
           <div className="relative">
           <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="pr-10"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          <button
             type="button"
             onClick={() => setShowPassword((v) => !v)}
             aria-label={showPassword ? "Hide password" : "Show password"}
             className="absolute right-3 top-1/2 -translate-y-1/2
                       text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
        
        <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-passwor"
                placeholder="*********"
                className="pr-10"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword", {
                   validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                       text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
             )}     
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
               <span className="size-4 rounded-full border-2 border-white/30
                             border-t-white animate-spin" />
               Creating account…
            </span>
            ) : (
              "Create account"
            )}
          </Button>
       </form>
    )
}

