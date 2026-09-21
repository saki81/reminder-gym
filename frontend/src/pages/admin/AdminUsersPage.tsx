import { useNavigate, useParams } from "react-router-dom";
import { UserTable } from "@/components/admin/UserTable";
import { UserDetailsSheet } from "@/components/admin/UserDetailsSheet";

export const AdminUsersPage = () => {
  const { userId } = useParams<{userId?: string}>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Overview and managment of all aplication users.
        </p>
      </div>
 
      <UserTable onViewDetails={(id) => navigate(`/admin/users/${id}`)}/>
      
      <UserDetailsSheet 
        userId={userId ?? null}
        open={!!userId}
        onOpenChange={(open) => {
         if (!open) navigate("/admin/users")
        }}
      />
    </div>

  )
}
