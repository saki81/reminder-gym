// shared/Loader.tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export const Loader = ({ size = "md", className, label }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2
        className={cn("animate-spin text-muted-foreground", sizeMap[size], className)}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};