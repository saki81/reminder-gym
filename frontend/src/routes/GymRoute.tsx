import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/shared/useAuth";
 

export function GymRoute(){
   const { user, isLoading, hasRole } = useAuth();

   if (isLoading) return null;

 // ADMIN bypasses gym requirement — they manage the whole platform
   if (hasRole(["ADMIN"])) return <Outlet />

   // User has a gym → proceed
   if (user?.gymId) return <Outlet />

   return <Navigate to="/gym/create" replace />
}