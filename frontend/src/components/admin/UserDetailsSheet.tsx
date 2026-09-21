import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "../shared/EmptyState";
import { useUserDetails } from "@/hooks/admin/useUserDetails";


interface UserDetailsSheetProps {
   userId: string | null;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const UserDetailsSheet = ({
    userId,
    open,
    onOpenChange
}: UserDetailsSheetProps) => {

    const { data: user, isLoading, isError} = useUserDetails(open ? userId : null)


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
           <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
             <SheetHeader>
               <SheetTitle>Detail users</SheetTitle>
               <SheetDescription>Overview of all data for the selected user</SheetDescription>
             </SheetHeader>

             <div className="mt-2 space-y-6 px-4 pb-6">
                {isLoading && (
                    <div className="flex justify-center py-6">
                        <Loader />
                    </div>
                )}

                {isError && !isLoading && (
                    <EmptyState 
                      title="Error loading"
                      description="Unable to load details for this user"/>
                )}

                {user && !isLoading && (
                  <>
                    <div className="space-y-1">
                       <p className="text-sm text-muted-foreground">Name</p>
                       <p className="font-medium">{user.name ?? "_"}</p>
                    </div>

                    <div className="space-y-1">
                       <p className="text-sm text-muted-foreground">Email</p>
                       <p className="font-medium">{user.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                       <Badge variant={user.isActive ? "default" : "secondary" }>
                          {user.isActive ? "Active" : "Inactive"}
                       </Badge> 
                       <Badge variant={user.emailVerified ? "outline" : "secondary" }>
                          {user.emailVerified ? "verified" : "not verified"}
                       </Badge> 
                    </div>

                    {user.emailVerifiedAt && (
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                               Email verified
                            </p>
                            <p className="text-sm">
                                 {new Date(user.emailVerifiedAt).toLocaleString("sr-Latn-BA")}
                            </p>
                        </div>
                    )}
                                  <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Teretane</p>
                {user.gyms.length === 0 ? (
                  <p className="text-sm">—</p>
                ) : (
                  <ul className="space-y-2">
                    {user.gyms.map((g) => (
                      <li
                        key={g.id}
                        className="rounded-md border p-2 text-sm"
                      >
                        <p className="font-medium">{g.gymName}</p>
                        <p className="text-muted-foreground">{g.city}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
 
              <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Kreiran</p>
                  <p>{new Date(user.createdAt).toLocaleDateString("sr-Latn-BA")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ažuriran</p>
                  <p>{new Date(user.updatedAt).toLocaleDateString("sr-Latn-BA")}</p>
                </div>
              </div>
             </>
              )}
            </div>
          </SheetContent>
       </Sheet>
    );
};