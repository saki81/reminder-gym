import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/shared/useAuth";
import { Loader2 } from "lucide-react";
 

export function GymRoute(){
   const { user, isLoading, hasRole } = useAuth();

  // if (isLoading) return null;
   if (isLoading && user === undefined) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }


 // ADMIN bypasses gym requirement — they manage the whole platform
   if (hasRole(["ADMIN"])) return <Outlet />

   // User has a gym → proceed
   if (/*user?.gymId*/user && user.gymId !== undefined) return <Outlet />

   return <Navigate to="/gym/create" replace />
}