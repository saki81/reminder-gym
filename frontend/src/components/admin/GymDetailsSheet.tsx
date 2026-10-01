import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGymDetails } from "@/hooks/admin/useGymDetails";


interface GymDeatailsSheetProps {
    gymId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void
}


export const GymDetailsSheet = ({ gymId, open, onOpenChange }: GymDeatailsSheetProps) => {
    const {data: gym, isLoading, isError} = useGymDetails(open ? gymId : null);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
           <SheetHeader>
             <SheetTitle>Gym Details</SheetTitle>
             <SheetDescription>Overview of all data for the selected gym</SheetDescription>
           </SheetHeader>

           <div className="mt-2 space-y-6 px-4 pb-6">
             {isLoading && (
                <div className="flex- justify-center py-6">
                  <Loader />
                </div>
             )}

             {isError && !isLoading && (
                <EmptyState 
                  title="Error loading"
                  description="Unable to load details for this gym"
                />
             )}

             {gym && !isLoading && (
                <>
                  <div className="space-y-1">
                   <p className="text-sm text-muted-foreground">Gym name</p>
                   <p className="font-medium">{gym.gymName}</p>
                  </div>

                  <div className="space-y-1">
                   <p className="text-sm text-muted-foreground">City</p>
                   <p className="font-medium">{gym.city}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={gym.isActive ? "default" : "secondary"}>
                        {gym.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Owner</p>
                    {gym.owner ? (
                       <div className="rounded-md border p-2 text-sm">
                        <p className="font-medium">{gym.owner.name}</p>
                        <p className="text-muted-foreground">{gym.owner.email}</p>
                       </div>
                    ) : (
                       <p className="text-sm">-</p>
                    )}
                  </div>

                   <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                    <div>
                     <p className="text-muted-foreground">Admins</p>
                     <p>{gym.counts.admins}</p>
                    </div>
                   <div>
                     <p className="text-muted-foreground">Equipment</p>
                     <p>{gym.counts.equipments}</p>
                   </div>
                   <div>
                     <p className="text-muted-foreground">Categories</p>
                     <p>{gym.counts.categories}</p>
                   </div>
                   <div>
                    <p className="text-muted-foreground">Maintenance records</p>
                    <p>{gym.counts.maintenances}</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                  <div>
                   <p className="text-muted-foreground">Created</p>
                   <p>{new Date(gym.createdAt).toLocaleDateString("sr-Latn-BA")}</p>
                  </div>
                  <div>
                   <p className="text-muted-foreground">Updated</p>
                   <p>{new Date(gym.updatedAt).toLocaleDateString("sr-Latn-BA")}</p>
                  </div>
                 </div>
                </>
             )}
           </div>


          </SheetContent>
        </Sheet>
    )
}