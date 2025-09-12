import { cn } from "@/lib/utils";
import type { BadgeProps } from "@/types";

const badgeVariants = {
  default: "bg-secondary text-secondary-foreground",
  artwork: "bg-primary/10 text-primary",
  series: "bg-accent text-accent-foreground", 
  sound: "bg-muted text-muted-foreground",
};

export default function Badge({ 
  children, 
  variant = "default",
  className 
}: BadgeProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}