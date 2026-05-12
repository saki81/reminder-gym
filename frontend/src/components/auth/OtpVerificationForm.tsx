import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Button } from "../ui/button";
import { useState } from "react";

type Props = {
  onSubmit: (otp: string) => void;
  onResend: () => void;
  isPending: boolean;
  isResending: boolean;

}

export const OtpVerificationForm = ({ onSubmit, onResend, isPending, isResending}: Props) => {
        
      const [value, setValue] = useState("");
      const isComplete = value.length === 6;

      return (
        <div className="space-y-6">

            <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={setValue}
                  autoFocus
                >
                    <InputOTPGroup>
                      <InputOTPSlot  index={0}/>
                      <InputOTPSlot  index={1}/>
                      <InputOTPSlot  index={2}/>
                      <InputOTPSlot  index={3}/>
                      <InputOTPSlot  index={4}/>
                      <InputOTPSlot  index={5}/>
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <Button
              type="button"
              className="w-full"
              disabled={!isComplete || isPending}
              onClick={() => onSubmit(value)}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/30
                                   border-t-white animate-spin" />
                  Verifying...
                </span>
              ) : (
                 "Verify code"
              )}
            </Button>

            {/* Resend */}
            <p className="text-center text-sm text-muted-foreground">
               Didn't receive it?{" "}
               {isPending ? (
                 <span className="font-medium">Code sent!</span>
               ) : (
                 <button
                   type="button"
                   onClick={onResend}
                   disabled={isResending}
                   className="text-primary font-medium hover:underline underline-offset-4
                              disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                      {isResending ? "Sending…" : "Resend code"}
                 </button>
               )}
            </p>
        </div>
      )
  
}