import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ForgotPassword }   from "@/types";
import type { UseFormSetError }  from "react-hook-form";
 
type Props = {
  onSubmit:  (data: ForgotPassword, setError: UseFormSetError<ForgotPassword>) => void;
  isPending: boolean;
};
 
export const ForgotPasswordForm = ({ onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPassword>();
 
  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, setError))}
      noValidate
      className="space-y-4"
    >
 
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
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
 
      <Button type="submit" className="w-full mt-2" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="size-4 rounded-full border-2 border-white/30
                             border-t-white animate-spin" />
            Sending code…
          </span>
        ) : (
          "Send reset code"
        )}
      </Button>
 
    </form>
  );
}
 
