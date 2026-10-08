import { AdminStatsCards }  from "@/components/admin/AdminStatsCards";
import { useAdminStats } from "@/hooks/admin/useAdminStats";
import { Loader } from "@/components/shared/Loader";

export const AdminPage = () => {
  const { data, isLoading } = useAdminStats()
  return (
    <>
      {isLoading || !data ? <Loader /> : (
        <>
          <AdminStatsCards data={data} />
        </>
      )}
     </>
  )
}
