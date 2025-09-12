import { cn } from "@/lib/utils";
import type { GridProps } from "@/types";

const gapVariants = {
  sm: "gap-4",      // 16px
  md: "gap-6",      // 24px  
  lg: "gap-8",      // 32px
};

export default function Grid12({ 
  children, 
  className,
  gap = "md"
}: GridProps) {
  return (
    <div 
      className={cn(
        "grid grid-cols-12",
        gapVariants[gap],
        className
      )}
    >
      {children}
    </div>
  );
}