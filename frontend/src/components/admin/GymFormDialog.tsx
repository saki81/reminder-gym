import { FormDialog } from "@/components/shared/FormDialog";
import { GymForm, type GymFormValues } from "@/components/admin/GymForm";
import { useCreateGym } from "@/hooks/admin/useCreateGym";
import { useUpdateGym } from "@/hooks/admin/useUpdateGym";
import { applyFieldErrors } from "@/hooks/shared/useFieldErrors";
import type { UseFormSetError } from "react-hook-form";


interface EditableGym {
   id: string;
   gymName: string;
   city: string;
}

interface GymFormDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   mode: "create" | "edit";
   gym?: EditableGym
}

export const GymFormDialog = ({ open, onOpenChange, mode, gym}: GymFormDialogProps) => {
   const createGym = useCreateGym();
   const updateGym = useUpdateGym();

   const isPending = mode === "create" ? createGym.isPending : updateGym.isPending;

   const handleSubmit = (data: GymFormValues, setError: UseFormSetError<GymFormValues>) => {
      if (mode === "create") {
        const payload = {
           gymName: data.gymName,
           city: data.city ?? "",
           ownerId: data.ownerId ?? "",
        };
        createGym.mutate(payload, {
           onSuccess: () => onOpenChange(false),
           onError: (error) => applyFieldErrors(error, setError)
        })
      } else if (gym) {
         const payload = {
            gymName: data.gymName,
            city: data.city ?? "",
         };
         updateGym.mutate({ id: gym.id, payload},
            {
                onSuccess: () => onOpenChange(false) ,
                onError: (error) => applyFieldErrors(error, setError)   
             
            }
         );
      }
   };

   return (
      <FormDialog 
        open={open}
        onOpenChange={onOpenChange}
        title={mode === "create" ? "Create gym" : "Edit gym"}
        description={
            mode === "create"
             ? "Add a new gym and assign an owner."
             : "Update the gym's name and city."
          }
        >

      <GymForm 
        mode={mode}
        defaultValues={gym}
        onSubmit={handleSubmit}
        isPending={isPending}
        onCancel={() => onOpenChange(false)}
        submitLabel={mode === "create" ? "Create" : "Save changes"}
       />
      </FormDialog>
   )
}