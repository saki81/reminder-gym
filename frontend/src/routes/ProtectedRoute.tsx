/*import { Navigate, Outlet } from "react-router-dom";
import { Loader2 }          from "lucide-react";
import { useAuth }          from "../hooks/shared/useAuth";
 
export function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
 
  if (isLoading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

   if (!user?.emailVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

 
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;*/

/*    const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

  return <Outlet />;*/
//}

import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "../hooks/shared/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();


  if (isLoading ) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background">
        <Loader2
          size={28}
          className="animate-spin text-primary"
        />
      </div>
    );
  }

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // email not verified
  if (!user?.emailVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

  return <Outlet />;
}
