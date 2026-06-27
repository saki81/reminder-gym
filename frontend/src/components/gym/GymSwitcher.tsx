// =============================================================================
// components/gym/GymSwitcher.tsx
// =============================================================================

import { useNavigate } from "react-router-dom";
import { Building2, Check, ChevronsUpDown, Plus, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton }     from "@/components/ui/skeleton";

import { useMyGyms }    from "@/hooks/gym/useMyGyms";
import { useSwitchGym } from "@/hooks/gym/useGymSwitch";
import { useGym }       from "@/hooks/shared/useGym";
import { useAuth }      from "@/hooks/shared/useAuth";
import type { Gym }     from "@/types";

export function GymSwitcher() {
  const navigate = useNavigate();
  const { gyms, isLoading }              = useMyGyms();
  const { mutate: switchGym, isPending } = useSwitchGym();
  const { currentGym }                   = useGym();
  const { hasRole }                      = useAuth();

  if (isLoading || !currentGym) {
    return <Skeleton className="h-9 w-44" />;
  }

  return (
    <DropdownMenu>

      {/* ── Trigger — direktan button bez Button komponente ──────── */}
      <DropdownMenuTrigger
        className="flex items-center gap-2 h-9 px-3 max-w-200
                   rounded-md border border-input bg-background text-sm
                   hover:bg-accent hover:text-accent-foreground
                   transition-colors outline-none"
      >
        <Building2 size={15} className="shrink-0 text-primary" />
        <span className="truncate flex-1 text-left">
          {currentGym.gymName}
        </span>
        <ChevronsUpDown size={13} className="shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      {/* ── Content ──────────────────────────────────────────────── */}
      <DropdownMenuContent align="start" className="w-56">
         <DropdownMenuGroup>
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
              onClick={() => { if (!isActive) switchGym(gym.id); }}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2 min-w-0">
                <Building2 size={13} className="shrink-0 text-muted-foreground" />
                <span className="truncate text-sm">{gym.gymName}</span>
              </span>
              {isActive && <Check size={13} className="text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
        {hasRole(["OWNER", "ADMIN"]) && (
          <DropdownMenuItem
            onClick={() => navigate("/gym/create")}
            className="cursor-pointer"
          >
            <Plus size={13} className="mr-2" />
            <span className="text-sm">New gym</span>
          </DropdownMenuItem>
        )}
        </DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => navigate("/gym/settings")}
          className="cursor-pointer"
        >
          <Settings size={13} className="mr-2" />
          <span className="text-sm">Gym settings</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}