import { useForm, type DefaultValues, type UseFormSetError } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import type { CreateGym } from "@/types";


type Props = {
    defaultValues?: DefaultValues<CreateGym>;
    onSubmit: (data: CreateGym, setError: UseFormSetError<CreateGym>) => void;
    isPending: boolean;
    submitLabel?: string;
};


export const GymForm = ({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Save"
}: Props) => {
   const {
     register,
     handleSubmit,
     setError,
     formState: { errors, isDirty}
   } = useForm<CreateGym>({defaultValues});


   return (
      <form
        onSubmit={handleSubmit((data) => onSubmit(data, setError))}
        noValidate
        className="space-y-4"
       >
        <div className="space-y-1.5">
          <Label htmlFor="gymName">Gym name</Label>
          <Input 
             id="gymName"
             placeholder="e.g. Gym Name"
             aria-invalid={!!errors.gymName}
           />
           {errors.gymName && (
              <p className="textt-xs text-destructive">{errors.gymName.message}</p>
           )}
        </div> 

        <div className="space-y-1.5">
            <Label htmlFor="city">
              City{" "}
               <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input 
               id="city"
               placeholder="e.g. City"
               {...register("city")}
            />
        </div>

        <Button
           type="submit"
           className="w-full"
           disabled={isPending || (!!defaultValues && !isDirty)}
         >
           {isPending ? (
             <span className="flex items-center gap-2">
             <span className="size-4 rounded-full border-2 border-white/30
                             border-t-white animate-spin" />
                 Saving…
             </span>
           ) : (
            submitLabel
           )}
        </Button>


      </form>
   )
}