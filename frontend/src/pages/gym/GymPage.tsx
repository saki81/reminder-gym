import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GymCard } from "@/components/gym/GymCard";
import { useMyGyms } from "@/hooks/gym/useMyGyms";
import { useSwitchGym } from "@/hooks/gym/useGymSwitch";
import { useGym } from "@/hooks/shared/useGym";
import { useAuth } from "@/hooks/shared/useAuth";
import type { Gym } from "@/types";



export const GymPage = () => {
  const navigate = useNavigate();
  const { gyms, isLoading } = useMyGyms();
  const { mutate: switchGym, isPending } = useSwitchGym();
  const { currentGym } = useGym();
  const { hasRole } = useAuth();

  if (isLoading) {
     return (
         <div className="flex items-center justify-center py-20">
            <span className="size-6 rounded-full border-2 border-primary/20
                         border-t-primary animate-spin block" />
         </div>
     );
  }
  return (
    <div className="space-y-6 max-w-xl">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Gyms</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {gyms.length === 1 
                 ? "You manage 1 gym"
                 : `You manage ${gyms.length} gyms`}
            </p>
          </div>
        {hasRole(["OWNER", "ADMIN"]) && ( 
             <Button
               variant="outline"
               size="sm"
               onClick={() => navigate("/gym/create")}
               className="gap-1.5"
             >
              <Plus size={15}/>
                 New gym
             </Button>
         )} 
       </div>

       <div className="space-y-3">
          {gyms.map((gym: Gym) => (
            <GymCard 
               key={gym.id}
               gym={gym}
               isActive={currentGym?.id === gym.id}
               isSwitching={isPending}
               canManage={hasRole(["OWNER", "ADMIN"])}
               onSwitch={() => switchGym(gym?.id)}
               onSettings={() => navigate("/gym/settings")}
/>
          ))}
       </div>
    </div>
  )
}
