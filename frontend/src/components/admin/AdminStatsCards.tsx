import type { ComponentType } from "react";
import { CircleOff, Dumbbell, UserCheck, UserX } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminDashboard } from "@/types";

type Props = {
    data: AdminDashboard;
};

type StatItem = {
   title: string;
   value: number;
   total: number;
   totalLabel: string;
   icon: ComponentType<{ className?: string }>;
   iconClassName: string;
}


export const AdminStatsCards = ({ data }: Props) => {
   const items: StatItem[] = [
   {
      title: "Active users",
      value: data.users.active,
      total: data.users.total,
      totalLabel: "users",
      icon: UserCheck,
      iconClassName: "text-emerald-600",
    },
    {
      title: "Deactivate Users",
      value: data.users.inactive,
      total: data.users.total,
      totalLabel: "users",
      icon: UserX,
      iconClassName: "text-destructive",
    },
    {
      title: "Active Gyms",
      value: data.gyms.active,
      total: data.gyms.total,
      totalLabel: "gyms",
      icon: Dumbbell,
      iconClassName: "text-emerald-600",
    },
    {
      title: "Deactivate Gyms",
      value: data.gyms.inactive,
      total: data.gyms.total,
      totalLabel: "gyms",
      icon: CircleOff,
      iconClassName: "text-destructive",
    },

   ];


   return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
         {items.map(({ title, value, total, totalLabel, icon: Icon, iconClassName }) => (
            <Card key={title}>
              <CardHeader>
                <CardDescription className="flex items-center justify-between">
                   {title}
                   <Icon className={cn("size-4", iconClassName)} />
                </CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">
                   {value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                   of total {total} {totalLabel}
              </CardContent>
            </Card>
         ))}
      </div>
   )
}