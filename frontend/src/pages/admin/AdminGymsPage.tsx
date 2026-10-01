import { useNavigate, useParams } from "react-router-dom"
import { GymTable } from "@/components/admin/GymTable";
import { GymDetailsSheet } from "@/components/admin/GymDetailsSheet";

export const AdminGymsPage = () => {
  const { gymId } = useParams<{ gymId?: string }>()
   const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Gyms</h1>
        <p className="text-sm text-muted-foreground">
          Overview and management of all gyms in the application.
        </p>
      </div>

      <GymTable onViewDetails={(id) => navigate(`/admin/gyms/${id}`)}/>

      <GymDetailsSheet 
        gymId={gymId ?? null}
        open={!!gymId}
        onOpenChange={(open) => {
           if (!open) navigate("/admin/gyms")
        }}
      />
    </div>
  )
}
