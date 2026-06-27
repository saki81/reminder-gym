import { useState }  from "react";
import { Loader2 }   from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button }    from "@/components/ui/button";
import { GymForm }   from "@/components/gym/GymForm";
import { useUpdateGym } from "@/hooks/gym/useUpdateGym";
import { useDeleteGym } from "@/hooks/gym/useDeleteGym";
import { useGym }    from "@/hooks/shared/useGym";
import { useToast }  from "@/hooks/shared/useToast";
import {
  applyFieldErrors,
  getErrorMessage,
  getFieldErrors,
} from "@/hooks/shared/useFieldErrors";
import type { CreateGym, UpdateGym }       from "@/types";
import type { UseFormSetError } from "react-hook-form";


export const GymSettingsPage = () => {
  const { currentGym } = useGym();
  const { mutate: updateGym, isPending: isUpdating } = useUpdateGym();
  const { mutate: deleteGym, isPending: isDeleting } = useDeleteGym();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
 
if (!currentGym) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }
 
  const handleSubmit = (
    data: UpdateGym,
    setError: UseFormSetError<CreateGym>
  ) => {
    updateGym(data, {
      onError: (err) => {
        const fieldErrors    = getFieldErrors(err);
        const hasFieldErrors = Object.keys(fieldErrors).length > 0;
 
        if (hasFieldErrors) {
          applyFieldErrors(err, setError);
        } else {
          toast.error(getErrorMessage(err, "Failed to update gym."));
        }
      },
    });
  };
 
  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteGym(currentGym.id);
  };
 
  return (
    <div className="space-y-6 max-w-lg">
 
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gym settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage settings for {currentGym.gymName}
        </p>
      </div>
 
      {/* Update form */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase
                         tracking-wider">
            General
          </h2>
        </CardHeader>
        <CardContent>
          <GymForm
            defaultValues={{ gymName: currentGym.gymName, city: currentGym.city }}
            onSubmit={handleSubmit}
            isPending={isUpdating}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
 
      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <h2 className="text-sm font-medium text-destructive">Danger zone</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Deleting this gym will permanently remove all equipment, maintenance
            records and categories. This action cannot be undone.
          </p>
 
          {confirmDelete && (
            <p className="text-sm font-medium text-destructive">
              Are you sure? Click again to confirm deletion.
            </p>
          )}
 
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/30
                                   border-t-white animate-spin" />
                  Deleting…
                </span>
              ) : confirmDelete ? (
                "Yes, delete gym"
              ) : (
                "Delete gym"
              )}
            </Button>
 
            {confirmDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
 
    </div>
  );

}
