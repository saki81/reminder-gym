import { Navigate, Outlet } from "react-router-dom";
import { useAuth }          from "../hooks/shared/useAuth";
 
type Props = {
  allowedRoles: string[];
};
 
export function RoleRoute({ allowedRoles }: Props) {
  const { hasRole, isLoading, user} = useAuth();

    console.log("RoleRoute user:", user);
    console.log("RoleRoute hasRole ADMIN:", hasRole(["ADMIN"]));
 
  // Still resolving — don't redirect yet
  if (isLoading) return null;
 
  return hasRole(allowedRoles)
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
}
