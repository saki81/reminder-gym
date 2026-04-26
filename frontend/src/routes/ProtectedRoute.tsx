import { Navigate, Outlet } from "react-router-dom";
import { Loader2 }          from "lucide-react";
import { useAuth }          from "../hooks/shared/useAuth";
 
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
 
  // Still waiting for /auth/me to resolve — block rendering
  if (isLoading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }
 
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}
