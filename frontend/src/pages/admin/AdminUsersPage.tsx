import { UserTable } from "@/components/admin/UserTable"
export const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Korisnici</h1>
        <p className="text-sm text-muted-foreground">
          Pregled i upravljanje svim korisnicima aplikacije.
        </p>
      </div>
 
      <UserTable />
    </div>

  )
}
