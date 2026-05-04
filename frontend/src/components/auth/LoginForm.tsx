import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

import type { Login } from "@/types";
import type { UseFormSetError } from "react-hook-form";


type Props = {
    onSubmit: (data: Login, setError: UseFormSetError<Login>) => void;
    isPending: boolean;
    error: unknown;
};

export const LoginForm = ({ onSubmit, isPending,}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
     register,
     handleSubmit,
     setError,
     formState: { errors },
  } = useForm<Login>();

  return (
     <form
       onSubmit={handleSubmit((data) => onSubmit(data, setError))}
       noValidate
       className="space-y-4"
       >
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline underline-offset-4"
              
             >
              Forgot Password
            </Link>
          </div>
         
         <div className="relative">
            <Input 
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="*********"
              className="pr-10"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "HidePassword" : "Show Password"}
              className="absolute right-3 top-1/2 -translate-y-1/2
              text-muted-foreground hover:text-foreground transition-colors"
             >
             {showPassword ? <EyeOff size={16} /> : <Eye size={16}/>}
            </button>
         </div>
          
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
       </div>

       <Button type="submit" size="lg" className="w-full mt-2 cursor-pointer " disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
               <span className="size-6 rounded-full border-2 border-white/30
                             border-t-white animate-spin text-lg tracking-wide" />
               Sign in…
            </span>
            ) : (
             <span className="text-lg tracking-wide">
                Sign in
             </span>
              
            )}
          </Button>
     </form>
  )
}