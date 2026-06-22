import { useNavigate } from "react-router-dom";
import { Building2, Check, ChevronsUpDown, Plus, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button }      from "@/components/ui/button";
import { useMyGyms } from "@/hooks/gym/useMyGyms";
import { useSwitchGym } from "@/hooks/gym/useGymSwitch";
import { useGym } from "@/hooks/shared/useGym";
import { useAuth } from "@/hooks/shared/useAuth";
import type { Gym } from "@/types";


export const GymSwitcher = () => {
    const navigate = useNavigate();
    const { gyms, isLoading } = useMyGyms();
    const { mutate: switchGym, isPending } = useSwitchGym();
    const { currentGym } = useGym();
    const { hasRole } = useAuth();

    if (isLoading || !currentGym) {
        return (
             <div className="h-9 w-40 rounded-md bg-muted animate-pulse" />
        )
    }

    return (
     <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          className="h-9 justify-between gap-2 max-w-52"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Building2 size={15} className="shrink-0 text-primary" />
            <span className="truncate text-sm">{currentGym.gymName}</span>
          </span>
          <ChevronsUpDown size={14} className="shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
 
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Your gyms
        </DropdownMenuLabel>
 
        <DropdownMenuSeparator />
 
        {gyms.map((gym: Gym) => {
          const isActive = gym.id === currentGym.id;
          return (
            <DropdownMenuItem
              key={gym.id}
              disabled={isActive || isPending}
              onClick={() => switchGym(gym.id, { context: gym } as any)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2 min-w-0">
                <Building2 size={14} className="shrink-0 text-muted-foreground" />
                <span className="truncate">{gym.gymName}</span>
              </span>
              {isActive && <Check size={14} className="text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
 
        <DropdownMenuSeparator />
 
        {hasRole(["OWNER", "ADMIN"]) && (
          <DropdownMenuItem
            onClick={() => navigate("/gym/create")}
            className="cursor-pointer"
          >
            <Plus size={14} className="mr-2" />
            Create new gym
          </DropdownMenuItem>
        )}
 
        <DropdownMenuItem
          onClick={() => navigate("/gym/settings")}
          className="cursor-pointer"
        >
          <Settings size={14} className="mr-2" />
          Gym settings
        </DropdownMenuItem>
 
      </DropdownMenuContent>
    </DropdownMenu>

    );
}