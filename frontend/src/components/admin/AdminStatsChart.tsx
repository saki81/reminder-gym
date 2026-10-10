import { Label, Pie, PieChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AdminDashboard } from "@/types/index";

type Props = {
    data: AdminDashboard;
};

const statusConfig = {
    active: { label: "Active", color: "var(--chart-2)" },
    inactive: { label: "Inactive", color: "var(--chart-5)" },
} satisfies ChartConfig;

type DonutProps = {
    title: string;
    description: string;
    stats: { total: number; active: number; inactive: number };
};


const StatusDonut = ({ title, description, stats }: DonutProps) => {
   const chartData = [
      { status: "active", value: stats.active, fill: "var(--color-active)" },
      { status: "inactive", value: stats.inactive, fill: "var(--color-inactive)" },
   ];

   return (
      <Card className="flex flex-col">
        <CardHeader>
           <CardTitle>{title}</CardTitle>
           <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
           <ChartContainer
              config={statusConfig}
              className="mx-auto aspect-square max-h-[260]"
            >
            <PieChart>
             <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="status" />}
               />
              <Pie
               data={chartData}
               dataKey="value"
               nameKey="status"
               innerRadius={65}
               strokeWidth={4}
             >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {stats.total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        Total
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
            />
          </PieChart>

           </ChartContainer>
        </CardContent>
      </Card>
   );
};

export const AdminStatsChart = ({ data }: Props) => {
   const barData = [
    { name: "Users", active: data.users.active, inactive: data.users.inactive },
    { name: "Gyms", active: data.gyms.active, inactive: data.gyms.inactive ,} 
  ];

   return (
     <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <StatusDonut
          title="Users"
          description="Active and inactive users"
          stats={data.users}
        />
        <StatusDonut
          title="Gyms"
          description="Active and inactive gyms"
          stats={data.gyms}
        />

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
            <CardDescription>active vs inactive</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={statusConfig} className="h-[260] w-full">
             <BarChart data={barData} accessibilityLayer>
               <CartesianGrid vertical={false} />
               <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
               <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
               <ChartTooltip content={<ChartTooltipContent />} />
               <ChartLegend content={<ChartLegendContent />} />
               <Bar dataKey="active" fill="var(--color-active)" radius={4} />
               <Bar dataKey="inactive" fill="var(--color-inactive)" radius={4} />
             </BarChart>
          </ChartContainer>

          </CardContent>
        </Card>
     </div>
   )
}