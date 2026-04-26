import { Navigate, Outlet } from "react-router-dom";
import { useAuth }          from "../hooks/shared/useAuth";
 
type Props = {
  allowedRoles: string[];
};
 
export function RoleRoute({ allowedRoles }: Props) {
  const { hasRole, isLoading } = useAuth();
 
  // Still resolving — don't redirect yet
  if (isLoading) return null;
 
  return hasRole(allowedRoles)
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
}
