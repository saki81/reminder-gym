import { Building2, Check } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Gym } from "@/types";


type Props = {
    gym: Gym;
    isActive: boolean;
    isSwitching: boolean;
    canManage: boolean;
    onSwitch: () => void;
    onSettings: () => void;
};

export const GymCard = ({
    gym,
    isActive,
    isSwitching,
    canManage,
    onSwitch,
    onSettings,
}: Props) => {
    return (
        <Card
          className={[
        "transition-colors",
        isActive ? "border-primary bg-primary/5" : "hover:border-primary/40",
       ].join(" ")}
      >
          <CardContent className="flex items-center gap-4 p-4">

            {/* Icon */}
            <div className="flex size-10 items-center justify-center
                        rounded-lg bg-primary/10 shrink-0">
               <Building2 size={20} className="text-primary" />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{gym.gymName}</p>
                {isActive && (
                    <Badge variant="secondary" className="text-[-11px]">
                       Active
                    </Badge>
                )}
              </div>
                {gym.city && (
                    <p className="text-xs text-muted-foreground">{gym.city}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
             {isActive ? (
              <Check size={18} className="text-primary" />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSwitching}
                  onClick={onSwitch}
                  className="text-xs h-8"
                >
                 Switch
               </Button>
              )}
             {canManage && (
               <Button
                 variant="ghost"
                 size="sm"
                 className="text-xs h-8"
                 onClick={onSettings}
                >
                Settings
              </Button>
             )}
            </div>
          </CardContent>
        </Card>
    )
}