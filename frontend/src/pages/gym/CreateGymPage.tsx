import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GymForm }      from "@/components/gym/GymForm";
import { useCreateGym } from "@/hooks/gym/useCreateGym";
import { useAuth }      from "@/hooks/shared/useAuth";
import { useToast }     from "@/hooks/shared/useToast";
import {
  applyFieldErrors,
  getErrorMessage,
  getFieldErrors,
} from "@/hooks/shared/useFieldErrors";
import type { CreateGym }       from "@/types";
import type { UseFormSetError } from "react-hook-form";


export const CreateGymPage = () => {
   const { user }  = useAuth();
  const toast     = useToast();
  const { mutate: createGym, isPending } = useCreateGym();
 
  const handleSubmit = (
    data: CreateGym,
    setError: UseFormSetError<CreateGym>
  ) => {
    createGym(data, {
      onError: (err) => {
        const fieldErrors    = getFieldErrors(err);
        const hasFieldErrors = Object.keys(fieldErrors).length > 0;
 
        if (hasFieldErrors) {
          applyFieldErrors(err, setError);
        } else {
          toast.error(getErrorMessage(err, "Failed to create gym. Try again."));
        }
      },
    });
  };
 
  return (
    <div className="min-h-svh grid place-items-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="text-center pb-2">
            <div className="inline-flex size-11 items-center justify-center
                            rounded-xl bg-primary mb-4 mx-auto">
              <Dumbbell size={22} color="white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create your gym</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {user?.name ?? user?.email}! Set up your gym to get started.
            </p>
          </CardHeader>
 
          <CardContent>
            <GymForm
              onSubmit={handleSubmit}
              isPending={isPending}
              submitLabel="Create gym"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );

}
