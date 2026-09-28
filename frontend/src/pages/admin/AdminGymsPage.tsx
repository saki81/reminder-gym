import { useNavigate, useParams } from "react-router-dom"
import { GymTable } from "@/components/admin/GymTable";

export const AdminGymsPage = () => {
 // const { gymId } = useParams<{ gymId?: string}>
   const navigate = useNavigate();

  return (
    <div><GymTable onViewDetails={(id) => navigate(`/admin/gyms/${id}`)}/></div>
  )
}
