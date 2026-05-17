import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import type { UseFormSetError } from "react-hook-form";


type ResetPasswordFormData = {
    password: string;
    confirmPassword: string;
};

type Props = {
    onSubmit: (password: string, setError: UseFormSetError<ResetPasswordFormData>) => void
    isPending: boolean;
}



export const ResetPasswordForm = ({ onSubmit, isPending}: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
       register, 
       handleSubmit, 
       setError, 
       watch,
       formState: { errors },
    } = useForm<ResetPasswordFormData>();

    const handleFormSubmit = ({ password }: ResetPasswordFormData) => {
        
        onSubmit(password, setError);
    }


    return(
        <form
           onSubmit={handleSubmit(handleFormSubmit)}
           noValidate
           className="space-y-4"
          >
            
            {/* new password */}
            <div className="space-y-5">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                   id="password"
                   type={showPassword ? "text" : "password"} 
                   autoComplete="new-password"
                   placeholder="********"
                   className="pr-10"
                   aria-invalid={!!errors.password}
                   {...register("password")}
                />
                <button
                   type="button"
                   onClick={() => setShowPassword((v) => !v)}
                   aria-label={showPassword ? "Hide Password" : "Show Password"}
                   className="absolute right-3 top-1/2 -translate-y-1/2
                              text-muted-foreground hover:text-foreground transition-colors"
                >
                   {showPassword ? <EyeOff size={16}/> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                 <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>


            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
               <div className="relative">
                <Input
                 id="confirmPassword"
                 type={showConfirm ? "text" : "password"}
                 autoComplete="new-password"
                 placeholder="••••••••"
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
                    Saving…
               </span>
                      ) : (
                  "Reset password"
                 )}
           </Button>
        </form>
    )
}